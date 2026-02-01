import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import Dashboard from '../pages/Dashboard';
import { AuthContext } from '../contexts/AuthContext';
import * as apiClient from '../services/apiClient';

jest.mock('../services/apiClient');

describe('Dashboard Page', () => {
  const mockUser = {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com',
  };

  const mockEnrollments = [
    {
      _id: '1',
      courseId: {
        _id: 'c1',
        title: 'React Basics',
        slug: 'react-basics',
      },
      progress: 60,
      lessons: [
        { _id: 'l1', title: 'Intro', completed: true },
        { _id: 'l2', title: 'Components', completed: true },
        { _id: 'l3', title: 'Hooks', completed: false },
      ],
      enrolledAt: new Date(),
    },
    {
      _id: '2',
      courseId: {
        _id: 'c2',
        title: 'Node.js',
        slug: 'nodejs',
      },
      progress: 30,
      lessons: [
        { _id: 'l1', title: 'Basics', completed: true },
        { _id: 'l2', title: 'Express', completed: false },
      ],
      enrolledAt: new Date(),
    },
  ];

  const renderComponent = () => {
    const authValue = {
      user: mockUser,
      loading: false,
      error: null,
    };

    apiClient.default.get.mockResolvedValue({
      data: {
        enrollments: mockEnrollments,
      },
    });

    return render(
      <AuthContext.Provider value={authValue}>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  };

  test('renders dashboard title', () => {
    renderComponent();
    expect(screen.getByText(/dashboard|my courses/i)).toBeInTheDocument();
  });

  test('displays user name', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });
  });

  test('fetches and displays enrolled courses', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('React Basics')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
    });
  });

  test('displays progress for each course', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/60%/)).toBeInTheDocument();
      expect(screen.getByText(/30%/)).toBeInTheDocument();
    });
  });

  test('displays lesson count', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/2 of 3 lessons/)).toBeInTheDocument();
      expect(screen.getByText(/1 of 2 lessons/)).toBeInTheDocument();
    });
  });

  test('shows empty state when no courses enrolled', async () => {
    apiClient.default.get.mockResolvedValue({
      data: {
        enrollments: [],
      },
    });

    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/no courses|not enrolled/i)).toBeInTheDocument();
    });
  });

  test('displays loading state', () => {
    apiClient.default.get.mockImplementation(() => new Promise(() => {}));
    renderComponent();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
