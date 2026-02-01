import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import Signup from '../pages/Signup';
import { AuthContext } from '../contexts/AuthContext';

describe('Signup Page', () => {
  const mockSignup = jest.fn();

  const renderComponent = () => {
    const authValue = {
      user: null,
      loading: false,
      error: null,
      signup: mockSignup,
      login: jest.fn(),
      logout: jest.fn(),
    };

    return render(
      <AuthContext.Provider value={authValue}>
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    mockSignup.mockClear();
  });

  test('renders signup form', () => {
    renderComponent();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    const user = userEvent.setup();
    mockSignup.mockResolvedValue({ success: true });

    renderComponent();

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/^password/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'password123');

    const button = screen.getByRole('button', { name: /sign up/i });
    await user.click(button);

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith('John Doe', 'john@example.com', 'password123');
    });
  });

  test('shows error when passwords do not match', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/^password/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'password456');

    const button = screen.getByRole('button', { name: /sign up/i });
    await user.click(button);

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    expect(mockSignup).not.toHaveBeenCalled();
  });

  test('shows error when password is too short', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/^password/i), '123');
    await user.type(screen.getByLabelText(/confirm password/i), '123');

    const button = screen.getByRole('button', { name: /sign up/i });
    await user.click(button);

    expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
  });

  test('shows link to login page', () => {
    renderComponent();
    const loginLink = screen.getByRole('link', { name: /login/i });
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});
