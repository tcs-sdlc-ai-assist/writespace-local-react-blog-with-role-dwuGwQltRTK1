import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { StatCard } from '../components/StatCard';
import { BlogCard } from '../components/BlogCard';
import { getPosts, getUsers } from '../utils/storage';

/**
 * Admin-only dashboard page rendered at '/admin'.
 * Displays stat cards (total posts, total users, admin count, user count) using StatCard component.
 * Shows quick action buttons (New Post, Manage Users).
 * Lists recent posts (up to 5).
 * Non-admins are redirected to /blogs via ProtectedRoute with role='admin'.
 * @returns {JSX.Element} The admin dashboard page element.
 */
export default function AdminDashboard() {
  const posts = getPosts();
  const users = getUsers();

  const totalPosts = posts.length;
  const totalUsers = users.length + 1; // +1 for hard-coded admin
  const adminCount = users.filter((u) => u.role === 'admin').length + 1; // +1 for hard-coded admin
  const userCount = users.filter((u) => u.role === 'user').length;

  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const accentColors = ['indigo', 'purple', 'blue', 'green', 'pink'];

  return (
    <div className="min-h-screen flex flex-col bg-secondary-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-secondary-900">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-secondary-500">
            Overview of your WriteSpace platform
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Posts"
            value={totalPosts}
            icon="📝"
            color="blue"
          />
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon="👥"
            color="green"
          />
          <StatCard
            title="Admins"
            value={adminCount}
            icon="👑"
            color="purple"
          />
          <StatCard
            title="Users"
            value={userCount}
            icon="📖"
            color="indigo"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/write"
              className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
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
              New Post
            </Link>
            <Link
              to="/admin/users"
              className="inline-flex items-center gap-2 rounded-md border border-secondary-300 bg-white px-4 py-2.5 text-sm font-semibold text-secondary-700 hover:bg-secondary-50 transition-colors"
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Manage Users
            </Link>
          </div>
        </div>

        {/* Recent Posts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary-900">
              Recent Posts
            </h2>
            <Link
              to="/blogs"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              View all →
            </Link>
          </div>

          {recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post, index) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  accentColor={accentColors[index % accentColors.length]}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-lg border border-secondary-200 bg-white">
              <div className="text-5xl mb-4 select-none">📝</div>
              <h3 className="text-lg font-semibold text-secondary-700 mb-2">
                No posts yet
              </h3>
              <p className="text-sm text-secondary-500 mb-6 max-w-md mx-auto">
                There are no blog posts on the platform yet. Create the first one!
              </p>
              <Link
                to="/write"
                className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
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
                Create First Post
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}