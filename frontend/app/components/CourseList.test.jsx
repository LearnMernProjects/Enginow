import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import CourseList from './CourseList';
import * as apiClient from '../services/apiClient';

// Mock the API client
jest.mock('../services/apiClient');

describe('CourseList Component', () => {
  const mockCourses = [
    {
      _id: '1',
      title: 'React Basics',
      description: 'Learn React',
      category: 'Frontend',
      difficulty: 'Beginner',
      slug: 'react-basics',
      price: 29.99,
    },
    {
      _id: '2',
      title: 'Node.js Advanced',
      description: 'Advanced Node.js',
      category: 'Backend',
      difficulty: 'Advanced',
      slug: 'node-advanced',
      price: 49.99,
    },
  ];

  beforeEach(() => {
    apiClient.default.get.mockResolvedValue({
      data: {
        courses: mockCourses,
        total: 2,
        pages: 1,
      },
    });
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <CourseList />
      </BrowserRouter>
    );
  };

  test('renders course list', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('React Basics')).toBeInTheDocument();
      expect(screen.getByText('Node.js Advanced')).toBeInTheDocument();
    });
  });

  test('displays correct number of courses', async () => {
    renderComponent();
    await waitFor(() => {
      const courseCards = screen.getAllByRole('link');
      expect(courseCards.length).toBeGreaterThanOrEqual(2);
    });
  });

  test('fetches courses on mount', async () => {
    renderComponent();
    await waitFor(() => {
      expect(apiClient.default.get).toHaveBeenCalledWith('/api/courses');
    });
  });

  test('displays loading state', () => {
    apiClient.default.get.mockImplementation(() => new Promise(() => {}));
    renderComponent();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('displays error message on API failure', async () => {
    apiClient.default.get.mockRejectedValue(new Error('API Error'));
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
    });
  });
});
