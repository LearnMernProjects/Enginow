import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../services/apiClient';

export default function Dashboard() {
  const { isAuthenticated, loading } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchEnrollments();
      fetchReviews();
    }
  }, [isAuthenticated]);

  const fetchEnrollments = async () => {
    try {
      const response = await apiClient.get('/api/enrollments/me');
      setEnrollments(response.data.enrollments);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch enrollments');
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await apiClient.get('/api/reviews/user/me');
      setReviews(response.data.reviews);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setDataLoading(false);
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
        <p className="text-gray-600 mb-8">Track your learning progress and manage your courses</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-blue-600">{enrollments.length}</div>
            <p className="text-gray-600">Courses Enrolled</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-green-600">
              {enrollments.filter(e => e.progressPercentage === 100).length}
            </div>
            <p className="text-gray-600">Completed Courses</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-purple-600">
              {reviews.length}
            </div>
            <p className="text-gray-600">Reviews Written</p>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">My Courses</h2>

          {enrollments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
              <Link
                to="/courses"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => (
                <div key={enrollment._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                      {enrollment.courseId.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4">
                      By {enrollment.courseId.instructor}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm font-bold text-blue-600">
                          {enrollment.progressPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${enrollment.progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-4">
                      {enrollment.progressPercentage === 100 ? (
                        <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-semibold">
                          ✓ Completed
                        </span>
                      ) : (
                        <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm font-semibold">
                          In Progress
                        </span>
                      )}
                    </div>

                    <div className="pt-4 border-t">
                      <Link
                        to={`/courses/${enrollment.courseId.slug}`}
                        className="block text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
                      >
                        Continue Learning
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Reviews</h2>

            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{review.courseId.title}</h3>
                    <div className="text-yellow-400 text-lg">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{review.comment}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
