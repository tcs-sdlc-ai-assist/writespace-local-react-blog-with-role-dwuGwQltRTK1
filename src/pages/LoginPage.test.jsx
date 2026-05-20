import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import * as auth from '../utils/auth';
import * as storage from '../utils/storage';

describe('LoginPage', () => {
  let getSessionSpy;
  let setSessionSpy;
  let getUsersSpy;

  beforeEach(() => {
    getSessionSpy = vi.spyOn(auth, 'getSession');
    setSessionSpy = vi.spyOn(auth, 'setSession');
    getUsersSpy = vi.spyOn(storage, 'getUsers');

    getSessionSpy.mockReturnValue(null);
    setSessionSpy.mockReturnValue(true);
    getUsersSpy.mockReturnValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Helper to render LoginPage within a MemoryRouter.
   * Includes routes for /admin and /blogs to detect redirects.
   */
  function renderLoginPage() {
    return render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<div>Admin Dashboard</div>} />
          <Route path="/blogs" element={<div>Blogs Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  }

  describe('rendering', () => {
    it('renders the login page heading', () => {
      renderLoginPage();

      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });

    it('renders the subheading text', () => {
      renderLoginPage();

      expect(
        screen.getByText('Sign in to your WriteSpace account')
      ).toBeInTheDocument();
    });

    it('renders the username input field', () => {
      renderLoginPage();

      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });

    it('renders the password input field', () => {
      renderLoginPage();

      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('renders the Sign In button', () => {
      renderLoginPage();

      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    });

    it('renders the link to register page', () => {
      renderLoginPage();

      const createLink = screen.getByText('Create one');
      expect(createLink).toBeInTheDocument();
      expect(createLink.closest('a')).toHaveAttribute('href', '/register');
    });
  });

  describe('form validation', () => {
    it('shows error when both fields are empty', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('All fields are required')).toBeInTheDocument();
    });

    it('shows error when username is empty', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Password'), 'somepassword');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('All fields are required')).toBeInTheDocument();
    });

    it('shows error when password is empty', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'someuser');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('All fields are required')).toBeInTheDocument();
    });

    it('shows error when username is only whitespace', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), '   ');
      await user.type(screen.getByLabelText('Password'), 'somepassword');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('All fields are required')).toBeInTheDocument();
    });

    it('shows error when password is only whitespace', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'someuser');
      await user.type(screen.getByLabelText('Password'), '   ');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('All fields are required')).toBeInTheDocument();
    });
  });

  describe('successful admin login', () => {
    it('redirects to /admin when logging in with admin credentials', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'admin');
      await user.type(screen.getByLabelText('Password'), 'admin');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      });
    });

    it('calls setSession with admin session data', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'admin');
      await user.type(screen.getByLabelText('Password'), 'admin');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(setSessionSpy).toHaveBeenCalledWith({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });
    });
  });

  describe('successful user login', () => {
    const mockUsers = [
      {
        id: 'u_1',
        displayName: 'Jane Doe',
        username: 'jane',
        password: 'password123',
        role: 'user',
        createdAt: '2024-06-01T10:00:00Z',
      },
    ];

    beforeEach(() => {
      getUsersSpy.mockReturnValue(mockUsers);
    });

    it('redirects to /blogs when logging in with valid user credentials', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'jane');
      await user.type(screen.getByLabelText('Password'), 'password123');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(screen.getByText('Blogs Page')).toBeInTheDocument();
      });
    });

    it('calls setSession with user session data', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'jane');
      await user.type(screen.getByLabelText('Password'), 'password123');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(setSessionSpy).toHaveBeenCalledWith({
        userId: 'u_1',
        username: 'jane',
        displayName: 'Jane Doe',
        role: 'user',
      });
    });

    it('redirects to /admin when user has admin role', async () => {
      getUsersSpy.mockReturnValue([
        {
          id: 'u_2',
          displayName: 'Admin User',
          username: 'adminuser',
          password: 'adminpass',
          role: 'admin',
          createdAt: '2024-06-01T10:00:00Z',
        },
      ]);

      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'adminuser');
      await user.type(screen.getByLabelText('Password'), 'adminpass');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      });
    });
  });

  describe('invalid credentials', () => {
    it('shows error for invalid username', async () => {
      getUsersSpy.mockReturnValue([]);
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'nonexistent');
      await user.type(screen.getByLabelText('Password'), 'somepassword');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
    });

    it('shows error for wrong password', async () => {
      getUsersSpy.mockReturnValue([
        {
          id: 'u_1',
          displayName: 'Jane Doe',
          username: 'jane',
          password: 'correctpassword',
          role: 'user',
          createdAt: '2024-06-01T10:00:00Z',
        },
      ]);

      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'jane');
      await user.type(screen.getByLabelText('Password'), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
    });

    it('shows error for wrong admin password', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'admin');
      await user.type(screen.getByLabelText('Password'), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
    });

    it('does not call setSession on invalid credentials', async () => {
      getUsersSpy.mockReturnValue([]);
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'nonexistent');
      await user.type(screen.getByLabelText('Password'), 'somepassword');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(setSessionSpy).not.toHaveBeenCalled();
    });
  });

  describe('redirect for already-authenticated users', () => {
    it('redirects admin session to /admin', async () => {
      getSessionSpy.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      renderLoginPage();

      await waitFor(() => {
        expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      });
    });

    it('redirects user session to /blogs', async () => {
      getSessionSpy.mockReturnValue({
        userId: 'u_1',
        username: 'jane',
        displayName: 'Jane Doe',
        role: 'user',
      });

      renderLoginPage();

      await waitFor(() => {
        expect(screen.getByText('Blogs Page')).toBeInTheDocument();
      });
    });

    it('does not render login form when already authenticated', async () => {
      getSessionSpy.mockReturnValue({
        userId: 'u_1',
        username: 'jane',
        displayName: 'Jane Doe',
        role: 'user',
      });

      renderLoginPage();

      await waitFor(() => {
        expect(screen.queryByText('Welcome Back')).not.toBeInTheDocument();
      });
    });
  });

  describe('error clearing', () => {
    it('clears previous error on new submission attempt', async () => {
      getUsersSpy.mockReturnValue([]);
      const user = userEvent.setup();
      renderLoginPage();

      // First attempt with invalid credentials
      await user.type(screen.getByLabelText('Username'), 'wrong');
      await user.type(screen.getByLabelText('Password'), 'wrong');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();

      // Clear fields and submit empty to get different error
      await user.clear(screen.getByLabelText('Username'));
      await user.clear(screen.getByLabelText('Password'));
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('All fields are required')).toBeInTheDocument();
      expect(screen.queryByText('Invalid username or password')).not.toBeInTheDocument();
    });
  });

  describe('calls getSession on mount', () => {
    it('checks for existing session on render', () => {
      renderLoginPage();

      expect(getSessionSpy).toHaveBeenCalled();
    });
  });
});