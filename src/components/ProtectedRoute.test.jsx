import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import * as auth from '../utils/auth';

describe('ProtectedRoute', () => {
  let getSessionSpy;

  beforeEach(() => {
    getSessionSpy = vi.spyOn(auth, 'getSession');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Helper to render ProtectedRoute within a MemoryRouter at a given path.
   * Includes a route for /login and /blogs to detect redirects.
   * @param {Object} options
   * @param {string} [options.initialPath] - The initial route path.
   * @param {string} [options.role] - Optional role prop for ProtectedRoute.
   * @param {JSX.Element} [options.children] - Children to render inside ProtectedRoute.
   */
  function renderWithRouter({ initialPath = '/protected', role, children } = {}) {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute role={role}>
                {children || <div>Protected Content</div>}
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/blogs" element={<div>Blogs Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  }

  describe('when no session exists', () => {
    it('redirects to /login when user is not authenticated', () => {
      getSessionSpy.mockReturnValue(null);

      renderWithRouter();

      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('does not render children when session is null', () => {
      getSessionSpy.mockReturnValue(null);

      renderWithRouter({
        children: <div>Secret Data</div>,
      });

      expect(screen.queryByText('Secret Data')).not.toBeInTheDocument();
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  describe('when session exists with user role', () => {
    it('renders children when no role prop is required', () => {
      getSessionSpy.mockReturnValue({
        userId: 'u_1',
        username: 'jane',
        displayName: 'Jane Doe',
        role: 'user',
      });

      renderWithRouter();

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });

    it('renders custom children when authorized', () => {
      getSessionSpy.mockReturnValue({
        userId: 'u_1',
        username: 'jane',
        displayName: 'Jane Doe',
        role: 'user',
      });

      renderWithRouter({
        children: <div>My Custom Page</div>,
      });

      expect(screen.getByText('My Custom Page')).toBeInTheDocument();
    });

    it('redirects to /blogs when non-admin accesses admin route', () => {
      getSessionSpy.mockReturnValue({
        userId: 'u_1',
        username: 'jane',
        displayName: 'Jane Doe',
        role: 'user',
      });

      renderWithRouter({ role: 'admin' });

      expect(screen.getByText('Blogs Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('when session exists with admin role', () => {
    it('renders children when no role prop is required', () => {
      getSessionSpy.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      renderWithRouter();

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('renders children when admin role is required and user is admin', () => {
      getSessionSpy.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      renderWithRouter({ role: 'admin' });

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(screen.queryByText('Blogs Page')).not.toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });

    it('renders custom children for admin on admin-protected route', () => {
      getSessionSpy.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      renderWithRouter({
        role: 'admin',
        children: <div>Admin Dashboard Content</div>,
      });

      expect(screen.getByText('Admin Dashboard Content')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('renders children when role prop is undefined and session exists', () => {
      getSessionSpy.mockReturnValue({
        userId: 'u_2',
        username: 'bob',
        displayName: 'Bob',
        role: 'user',
      });

      renderWithRouter({ role: undefined });

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('calls getSession to check authentication', () => {
      getSessionSpy.mockReturnValue(null);

      renderWithRouter();

      expect(getSessionSpy).toHaveBeenCalled();
    });

    it('redirects non-admin user to /blogs even with valid session for admin route', () => {
      getSessionSpy.mockReturnValue({
        userId: 'u_3',
        username: 'charlie',
        displayName: 'Charlie',
        role: 'user',
      });

      renderWithRouter({ role: 'admin' });

      expect(screen.getByText('Blogs Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });
  });
});