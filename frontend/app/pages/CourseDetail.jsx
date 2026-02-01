import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { EnrollmentButton } from '../components/EnrollmentButton';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../services/apiClient';

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    fetchCourseDetail();
  }, [slug]);

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/courses/${slug}`);
      setCourse(response.data.course);

      if (response.data.course.lessons.length > 0) {
        setSelectedLesson(response.data.course.lessons[0]);
      }

      // Fetch reviews
      try {
        const reviewsResponse = await apiClient.get(`/api/reviews/course/${response.data.course._id}`);
        setReviews(reviewsResponse.data.reviews);
        setAvgRating(reviewsResponse.data.averageRating);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch course');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading course...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Course not found'}
        </div>
        <button
          onClick={() => navigate('/courses')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-md py-12">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/courses')}
            className="text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Back to Courses
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>

              <div className="flex gap-4 mb-6">
                <span className={`text-sm px-3 py-1 rounded-full font-semibold ${difficultyColors[course.difficulty]}`}>
                  {course.difficulty}
                </span>
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {course.category}
                </span>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">By <strong>{course.instructor}</strong></p>
                <p className="text-lg text-gray-700">{course.description}</p>
              </div>

              {/* Rating */}
              <div className="mb-6 pb-6 border-b">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">{avgRating.toFixed(1)}</span>
                  <div>
                    <div className="text-yellow-400">★★★★★</div>
                    <p className="text-sm text-gray-600">({reviews.length} reviews)</p>
                  </div>
                </div>
              </div>

              {/* Lessons */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
                <p className="text-gray-600 mb-4">{course.lessons.length} lessons</p>

                <div className="space-y-2">
                  {course.lessons.map((lesson, index) => (
                    <button
                      key={lesson._id}
                      onClick={() => setSelectedLesson(lesson)}
                      className={`w-full text-left p-4 rounded-lg transition ${
                        selectedLesson?._id === lesson._id
                          ? 'bg-blue-100 border-2 border-blue-600'
                          : 'bg-gray-100 hover:bg-gray-200 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-gray-600 font-semibold min-w-8">
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                          {lesson.videoUrl && <p className="text-sm text-gray-600 mt-1">🎥 Video lesson</p>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Lesson Preview */}
              {selectedLesson && (
                <div className="bg-white rounded-lg p-6 border">
                  <h3 className="text-xl font-bold mb-4">Preview: {selectedLesson.title}</h3>
                  {selectedLesson.videoUrl && (
                    <div className="mb-6 bg-black h-96 rounded-lg flex items-center justify-center">
                      <div className="text-white text-center">
                        <p className="mb-2">🎥 Video Content</p>
                        <p className="text-sm">{selectedLesson.videoUrl}</p>
                      </div>
                    </div>
                  )}
                  <div className="prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: selectedLesson.contentHtml }} />
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
                <div className="mb-6">
                  <img
                    src={course.thumbnailUrl || 'https://via.placeholder.com/300x200?text=' + course.title}
                    alt={course.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />

                  <div className="text-3xl font-bold text-gray-900 mb-4">
                    ${course.price.toFixed(2)}
                  </div>

                  <EnrollmentButton courseId={course._id} />

                  <div className="mt-6 pt-6 border-t space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Lessons</p>
                      <p className="text-lg font-semibold">{course.lessons.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Difficulty</p>
                      <p className="text-lg font-semibold capitalize">{course.difficulty}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Instructor</p>
                      <p className="text-lg font-semibold">{course.instructor}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Student Reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{review.userId.name}</p>
                    <p className="text-sm text-gray-600">{review.userId.email}</p>
                  </div>
                  <div className="text-yellow-400 text-lg">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-xs text-gray-500 mt-3">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
