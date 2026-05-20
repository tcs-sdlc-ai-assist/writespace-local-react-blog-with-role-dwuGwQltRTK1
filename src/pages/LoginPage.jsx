import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, setSession } from '../utils/auth';
import { getUsers } from '../utils/storage';
import { PublicNavbar } from '../components/PublicNavbar';

/**
 * Login page component rendered at '/login'.
 * Form with username and password fields.
 * Validates against hard-coded admin ('admin'/'admin') first, then checks localStorage users.
 * On success, writes session via setSession() and redirects to /blogs (user) or /admin (admin).
 * Shows error messages for invalid credentials.
 * Redirects already-authenticated users away.
 * @returns {JSX.Element} The login page element.
 */
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const session = getSession();
    if (session) {
      if (session.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/blogs', { replace: true });
      }
    }
  }, [navigate]);

  /**
   * Handle form submission for login.
   * @param {React.FormEvent} e - The form event.
   */
  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('All fields are required');
      return;
    }

    setLoading(true);

    try {
      // Check hard-coded admin first
      if (username.trim() === 'admin' && password === 'admin') {
        const session = {
          userId: 'admin',
          username: 'admin',
          displayName: 'Admin',
          role: 'admin',
        };
        setSession(session);
        navigate('/admin', { replace: true });
        return;
      }

      // Check localStorage users
      const users = getUsers();
      const user = users.find(
        (u) => u.username === username.trim() && u.password === password
      );

      if (!user) {
        setError('Invalid username or password');
        setLoading(false);
        return;
      }

      const session = {
        userId: user.id,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
      };
      setSession(session);

      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/blogs', { replace: true });
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-secondary-50">
      <PublicNavbar />

      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-secondary-200 bg-white p-8 shadow-sm">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-secondary-900">
                Welcome Back
              </h1>
              <p className="mt-2 text-sm text-secondary-500">
                Sign in to your WriteSpace account
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-secondary-700 mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-md border border-secondary-300 bg-white px-4 py-2.5 text-sm text-secondary-900 placeholder-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-secondary-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-secondary-300 bg-white px-4 py-2.5 text-sm text-secondary-900 placeholder-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-md px-4 py-2.5 text-sm font-semibold text-white transition-colors ${
                  loading
                    ? 'bg-primary-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-secondary-500">
                Don&apos;t have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}