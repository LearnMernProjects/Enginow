import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { PrivateRoute } from './PrivateRoute';
import { AuthContext } from '../contexts/AuthContext';

describe('PrivateRoute Component', () => {
  const MockComponent = () => <div>Protected Content</div>;

  const renderWithAuth = (user = null, requireAdmin = false) => {
    const authValue = {
      user,
      loading: false,
      error: null,
      signup: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
    };

    return render(
      <AuthContext.Provider value={authValue}>
        <BrowserRouter>
          <PrivateRoute requireAdmin={requireAdmin}>
            <MockComponent />
          </PrivateRoute>
        </BrowserRouter>
      </AuthContext.Provider>
    );
  };

  test('shows loading state when checking auth', () => {
    const authValue = {
      user: null,
      loading: true,
      error: null,
    };

    render(
      <AuthContext.Provider value={authValue}>
        <BrowserRouter>
          <PrivateRoute>
            <MockComponent />
          </PrivateRoute>
        </BrowserRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders protected content when user is authenticated', () => {
    const user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
    };

    renderWithAuth(user);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('redirects to login when user is not authenticated', () => {
    renderWithAuth(null);
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('allows admin user to access admin route', () => {
    const adminUser = {
      id: '1',
      name: 'Admin',
      email: 'admin@example.com',
      role: 'admin',
    };

    renderWithAuth(adminUser, true);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('denies regular user from accessing admin route', () => {
    const regularUser = {
      id: '1',
      name: 'User',
      email: 'user@example.com',
      role: 'user',
    };

    renderWithAuth(regularUser, true);
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
