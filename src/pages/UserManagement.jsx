import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { UserRow } from '../components/UserRow';
import { getUsers, saveUsers } from '../utils/storage';

/**
 * Admin-only user management page rendered at '/admin/users'.
 * Contains a create user form (display name, username, password, role select) with validations.
 * Displays user table/cards using UserRow component.
 * Admin can delete users except hard-coded admin (username 'admin') and self.
 * Non-admins are redirected to /blogs via ProtectedRoute with role='admin'.
 * @returns {JSX.Element} The user management page element.
 */
export default function UserManagement() {
  const [users, setUsers] = useState(() => getUsers());
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Generate a unique user ID.
   * @returns {string} A unique ID string prefixed with 'u_'.
   */
  function generateId() {
    return 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  /**
   * Handle form submission for creating a new user.
   * @param {React.FormEvent} e - The form event.
   */
  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!displayName.trim() || !username.trim() || !password.trim()) {
      setError('All fields are required');
      return;
    }

    setLoading(true);

    try {
      // Check if username is the hard-coded admin
      if (username.trim() === 'admin') {
        setError('Username already exists');
        setLoading(false);
        return;
      }

      // Check localStorage users for uniqueness
      const currentUsers = getUsers();
      const existingUser = currentUsers.find((u) => u.username === username.trim());

      if (existingUser) {
        setError('Username already exists');
        setLoading(false);
        return;
      }

      const newUser = {
        id: generateId(),
        displayName: displayName.trim(),
        username: username.trim(),
        password: password,
        role: role,
        createdAt: new Date().toISOString(),
      };

      currentUsers.push(newUser);
      saveUsers(currentUsers);
      setUsers(currentUsers);

      setDisplayName('');
      setUsername('');
      setPassword('');
      setRole('user');
      setSuccess(`User "${newUser.displayName}" created successfully`);
      setLoading(false);
    } catch (err) {
      console.error('Failed to create user:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }

  /**
   * Handle user deletion by ID.
   * Removes the user from localStorage and updates state.
   * @param {string} userId - The ID of the user to delete.
   */
  function handleDelete(userId) {
    try {
      const currentUsers = getUsers();
      const updatedUsers = currentUsers.filter((u) => u.id !== userId);
      saveUsers(updatedUsers);
      setUsers(updatedUsers);
      setSuccess('User deleted successfully');
      setError('');
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError('Failed to delete user. Please try again.');
    }
  }

  // Build the full user list including the hard-coded admin
  const hardCodedAdmin = {
    id: 'admin',
    displayName: 'Admin',
    username: 'admin',
    role: 'admin',
    createdAt: new Date('2024-01-01').toISOString(),
  };

  const allUsers = [hardCodedAdmin, ...users];

  return (
    <div className="min-h-screen flex flex-col bg-secondary-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-secondary-900">
            User Management
          </h1>
          <p className="mt-1 text-sm text-secondary-500">
            Create and manage platform users
          </p>
        </div>

        {/* Create User Form */}
        <div className="rounded-lg border border-secondary-200 bg-white shadow-sm p-6 sm:p-8 mb-8">
          <h2 className="text-lg font-semibold text-secondary-900 mb-6">
            Create New User
          </h2>

          {error && (
            <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-md bg-green-50 border border-green-200 p-4">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-secondary-700 mb-1"
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  autoComplete="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="block w-full rounded-md border border-secondary-300 bg-white px-4 py-2.5 text-sm text-secondary-900 placeholder-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                  placeholder="Enter display name"
                />
              </div>

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
                  placeholder="Choose a username"
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
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-secondary-300 bg-white px-4 py-2.5 text-sm text-secondary-900 placeholder-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-secondary-700 mb-1"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="block w-full rounded-md border border-secondary-300 bg-white px-4 py-2.5 text-sm text-secondary-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-secondary-100">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-white transition-colors ${
                  loading
                    ? 'bg-primary-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {loading ? 'Creating…' : 'Create User'}
              </button>
            </div>
          </form>
        </div>

        {/* Users List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary-900">
              All Users ({allUsers.length})
            </h2>
          </div>

          {allUsers.length > 0 ? (
            <div className="space-y-3">
              {allUsers.map((user) => (
                <UserRow key={user.id} user={user} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-lg border border-secondary-200 bg-white">
              <div className="text-5xl mb-4 select-none">👥</div>
              <h3 className="text-lg font-semibold text-secondary-700 mb-2">
                No users yet
              </h3>
              <p className="text-sm text-secondary-500 max-w-md mx-auto">
                Create your first user using the form above.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}