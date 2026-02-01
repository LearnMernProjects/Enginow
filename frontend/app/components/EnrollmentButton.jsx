import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../services/apiClient';

export const EnrollmentButton = ({ courseId, onEnrollSuccess }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      checkEnrollment();
    }
  }, [isAuthenticated, courseId]);

  const checkEnrollment = async () => {
    try {
      const response = await apiClient.get('/api/enrollments/me');
      const enrolled = response.data.enrollments.some(e => e.courseId._id === courseId);
      setIsEnrolled(enrolled);
    } catch (err) {
      console.error('Error checking enrollment:', err);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isEnrolled) {
      return; // Already enrolled
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/api/enrollments', {
        courseId,
      });

      setIsEnrolled(true);
      if (onEnrollSuccess) {
        onEnrollSuccess(response.data.enrollment);
      }
    } catch (err) {
      const message = err.response?.data?.error || 'Enrollment failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (isEnrolled) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded">
        ✓ You are enrolled in this course
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <button
        onClick={handleEnroll}
        disabled={loading}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? 'Enrolling...' : 'Enroll Now'}
      </button>
    </div>
  );
};
