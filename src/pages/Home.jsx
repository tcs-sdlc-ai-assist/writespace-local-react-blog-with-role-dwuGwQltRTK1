import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { BlogCard } from '../components/BlogCard';
import { getPosts } from '../utils/storage';

/**
 * Authenticated blog list page rendered at '/blogs'.
 * Displays all posts from localStorage in a responsive grid of BlogCard components,
 * sorted newest first. Shows empty state with CTA to create first post when no posts exist.
 * Includes 'New Post' button linking to /write.
 * @returns {JSX.Element} The home/blog list page element.
 */
export default function Home() {
  const posts = getPosts();

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const accentColors = ['indigo', 'purple', 'blue', 'green', 'pink', 'amber', 'red'];

  return (
    <div className="min-h-screen flex flex-col bg-secondary-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">All Posts</h1>
            <p className="mt-1 text-sm text-secondary-500">
              Browse the latest stories from the community
            </p>
          </div>
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
        </div>

        {sortedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPosts.map((post, index) => (
              <BlogCard
                key={post.id}
                post={post}
                accentColor={accentColors[index % accentColors.length]}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-lg border border-secondary-200 bg-white">
            <div className="text-5xl mb-4 select-none">📝</div>
            <h2 className="text-xl font-semibold text-secondary-700 mb-2">
              No posts yet
            </h2>
            <p className="text-sm text-secondary-500 mb-6 max-w-md mx-auto">
              It looks like there are no blog posts yet. Be the first to share
              your story on WriteSpace!
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
              Create Your First Post
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}