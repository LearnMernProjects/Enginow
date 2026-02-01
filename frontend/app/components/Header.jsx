import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          ELearning
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/courses" className="text-gray-700 hover:text-blue-600 transition">
            Courses
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition">
                Dashboard
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition font-semibold">
                  Admin
                </Link>
              )}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
