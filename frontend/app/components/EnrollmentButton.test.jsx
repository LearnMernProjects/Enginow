import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import EnrollmentButton from './EnrollmentButton';
import { AuthContext } from '../contexts/AuthContext';
import * as apiClient from '../services/apiClient';

jest.mock('../services/apiClient');

describe('EnrollmentButton Component', () => {
  const mockCourse = {
    _id: '1',
    title: 'React Course',
    slug: 'react-course',
  };

  const mockUser = {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com',
  };

  const renderComponent = (user = mockUser, isEnrolled = false) => {
    const authValue = {
      user,
      loading: false,
      error: null,
    };

    return render(
      <AuthContext.Provider value={authValue}>
        <BrowserRouter>
          <EnrollmentButton course={mockCourse} isEnrolled={isEnrolled} onEnroll={jest.fn()} />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  };

  test('renders "Enroll Now" button when not enrolled', () => {
    renderComponent(mockUser, false);
    expect(screen.getByText('Enroll Now')).toBeInTheDocument();
  });

  test('renders "Already Enrolled" button when enrolled', () => {
    renderComponent(mockUser, true);
    expect(screen.getByText('Already Enrolled')).toBeInTheDocument();
  });

  test('shows "Sign in to enroll" when user is not authenticated', () => {
    renderComponent(null, false);
    expect(screen.getByText(/sign in to enroll|login/i)).toBeInTheDocument();
  });

  test('calls enroll API when button is clicked', async () => {
    const user = userEvent.setup();
    apiClient.default.post.mockResolvedValue({ data: { success: true } });

    renderComponent(mockUser, false);
    const button = screen.getByText('Enroll Now');
    await user.click(button);

    await waitFor(() => {
      expect(apiClient.default.post).toHaveBeenCalledWith('/api/enrollments', {
        courseId: mockCourse._id,
      });
    });
  });

  test('displays error message on enrollment failure', async () => {
    const user = userEvent.setup();
    apiClient.default.post.mockRejectedValue(new Error('Enrollment failed'));

    renderComponent(mockUser, false);
    const button = screen.getByText('Enroll Now');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/failed|error/i)).toBeInTheDocument();
    });
  });

  test('button is disabled when enrolled', () => {
    renderComponent(mockUser, true);
    const button = screen.getByText('Already Enrolled');
    expect(button).toBeDisabled();
  });
});
