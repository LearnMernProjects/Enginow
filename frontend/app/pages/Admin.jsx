import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../services/apiClient';

export default function Admin() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: '',
    category: 'programming',
    difficulty: 'beginner',
    instructor: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchData();
    }
  }, [isAuthenticated, isAdmin, activeTab]);

  const fetchData = async () => {
    try {
      setDataLoading(true);

      if (activeTab === 'courses') {
        const response = await apiClient.get('/api/courses?limit=100');
        setCourses(response.data.courses);
      } else if (activeTab === 'users') {
        const response = await apiClient.get('/api/users?limit=100');
        setUsers(response.data.users);
      } else if (activeTab === 'stats') {
        const enrollmentStats = await apiClient.get('/api/enrollments/stats/all');
        setStats(enrollmentStats.data.stats);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch data');
    } finally {
      setDataLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingCourse) {
        // Update existing course
        await apiClient.put(`/api/courses/${editingCourse._id}`, formData);
        setSuccess('Course updated successfully!');
      } else {
        // Create new course
        await apiClient.post('/api/courses', formData);
        setSuccess('Course created successfully!');
      }

      // Reset form
      setFormData({
        title: '',
        slug: '',
        description: '',
        price: '',
        category: 'programming',
        difficulty: 'beginner',
        instructor: '',
      });
      setEditingCourse(null);
      setShowForm(false);

      // Refresh courses
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save course');
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      slug: course.slug,
      description: course.description,
      price: course.price,
      category: course.category,
      difficulty: course.difficulty,
      instructor: course.instructor,
    });
    setShowForm(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      await apiClient.delete(`/api/courses/${courseId}`);
      setSuccess('Course deleted successfully!');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete course');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await apiClient.delete(`/api/users/${userId}`);
      setSuccess('User deleted successfully!');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
        <p className="text-gray-600 mb-8">Manage your courses, users, and view platform statistics</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'courses'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Courses
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'users'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'stats'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Statistics
          </button>
        </div>

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingCourse(null);
                setFormData({
                  title: '',
                  slug: '',
                  description: '',
                  price: '',
                  category: 'programming',
                  difficulty: 'beginner',
                  instructor: '',
                });
              }}
              className="mb-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              {showForm ? 'Cancel' : '+ Add New Course'}
            </button>

            {/* Course Form */}
            {showForm && (
              <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">
                  {editingCourse ? 'Edit Course' : 'Create New Course'}
                </h2>

                <form onSubmit={handleSubmitCourse} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Course Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slug *
                      </label>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instructor *
                      </label>
                      <input
                        type="text"
                        name="instructor"
                        value={formData.instructor}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleFormChange}
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      >
                        <option value="programming">Programming</option>
                        <option value="design">Design</option>
                        <option value="business">Business</option>
                        <option value="marketing">Marketing</option>
                        <option value="personal-development">Personal Development</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Difficulty
                      </label>
                      <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      required
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    {editingCourse ? 'Update Course' : 'Create Course'}
                  </button>
                </form>
              </div>
            )}

            {/* Courses List */}
            {dataLoading ? (
              <div className="text-center py-8">Loading courses...</div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {courses.map((course) => (
                  <div key={course._id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{course.title}</h3>
                        <p className="text-sm text-gray-600">By {course.instructor}</p>
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        ${course.price.toFixed(2)}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">{course.description}</p>

                    <div className="flex gap-4 justify-end">
                      <button
                        onClick={() => handleEditCourse(course)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            {dataLoading ? (
              <div className="text-center py-8">Loading users...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg shadow-md">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold">Name</th>
                      <th className="px-6 py-3 text-left font-semibold">Email</th>
                      <th className="px-6 py-3 text-left font-semibold">Role</th>
                      <th className="px-6 py-3 text-left font-semibold">Joined</th>
                      <th className="px-6 py-3 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-3">{user.name}</td>
                        <td className="px-6 py-3">{user.email}</td>
                        <td className="px-6 py-3">
                          <span
                            className={`px-3 py-1 rounded text-sm font-semibold ${
                              user.role === 'admin'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3">
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div>
            {dataLoading ? (
              <div className="text-center py-8">Loading statistics...</div>
            ) : stats ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-8">
                  <p className="text-gray-600 mb-2">Total Enrollments</p>
                  <div className="text-4xl font-bold text-blue-600">
                    {stats.totalEnrollments}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8">
                  <p className="text-gray-600 mb-2">Completed Enrollments</p>
                  <div className="text-4xl font-bold text-green-600">
                    {stats.completedEnrollments}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    ({stats.completionRate}% completion rate)
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8">
                  <p className="text-gray-600 mb-2">Average Progress</p>
                  <div className="text-4xl font-bold text-purple-600">
                    {Math.round(stats.averageProgress)}%
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">No statistics available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
