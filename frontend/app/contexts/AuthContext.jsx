import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await apiClient.get('/api/auth/me');
          setUser(response.data.user);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        // Clear token if verification fails
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Helper function to validate email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Helper function to validate password
  const validatePassword = (password) => {
    return password && password.length >= 6;
  };

  const signup = async (name, email, password) => {
    try {
      setError(null);

      // Client-side validation
      if (!name || name.trim().length < 2) {
        throw new Error('Name must be at least 2 characters long');
      }

      if (!validateEmail(email)) {
        throw new Error('Please provide a valid email address');
      }

      if (!validatePassword(password)) {
        throw new Error('Password must be at least 6 characters long');
      }

      const response = await apiClient.post('/api/auth/signup', { name, email, password });
      
      // Support both httpOnly cookies (handled automatically) and localStorage fallback
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      
      return response.data;
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Signup failed';
      setError(message);
      throw new Error(message);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);

      // Client-side validation
      if (!validateEmail(email)) {
        throw new Error('Please provide a valid email address');
      }

      if (!validatePassword(password)) {
        throw new Error('Please provide a valid password');
      }

      const response = await apiClient.post('/api/auth/login', { email, password });
      
      // Support both httpOnly cookies (handled automatically) and localStorage fallback
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      
      return response.data;
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint to clear httpOnly cookie on server
      await apiClient.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout API call failed:', err);
    } finally {
      // Clear client-side data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setError(null);
    }
  };

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
