import React, { useState, useEffect } from 'react';
import { CourseList } from '../components/CourseList';
import { FilterBar } from '../components/FilterBar';
import apiClient from '../services/apiClient';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ category: '', difficulty: '', search: '' });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchCourses = async (page = 1, filterParams = {}) => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        page,
        limit: 9,
        ...filterParams,
      });

      const response = await apiClient.get(`/api/courses?${params}`);
      setCourses(response.data.courses);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Build query params from filters
    const queryParams = {};
    if (filters.category) queryParams.category = filters.category;
    if (filters.difficulty) queryParams.difficulty = filters.difficulty;
    if (filters.search) queryParams.search = filters.search;

    fetchCourses(1, queryParams);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (newPage) => {
    const queryParams = {};
    if (filters.category) queryParams.category = filters.category;
    if (filters.difficulty) queryParams.difficulty = filters.difficulty;
    if (filters.search) queryParams.search = filters.search;

    fetchCourses(newPage, queryParams);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">Explore Courses</h1>
        <p className="text-gray-600 mb-12">
          Choose from our wide range of courses and start learning today.
        </p>

        {/* Filter Bar */}
        <FilterBar onFilterChange={handleFilterChange} loading={loading} />

        {/* Course List */}
        <CourseList courses={courses} loading={loading} error={error} />

        {/* Pagination */}
        {!loading && courses.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                let pageNum = pagination.page - 2 + i;
                if (pageNum < 1) pageNum = 1 + i;
                if (pageNum > pagination.pages) pageNum = pagination.pages - 4 + i;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 rounded transition ${
                      pageNum === pagination.page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        )}

        {/* Summary */}
        {!loading && (
          <p className="text-center text-gray-600 mt-8">
            Showing {courses.length} of {pagination.total} courses
          </p>
        )}
      </div>
    </div>
  );
}
