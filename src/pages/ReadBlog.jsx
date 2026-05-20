import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { getAvatar } from '../components/Avatar';
import { getSession } from '../utils/auth';
import { getPosts, savePosts } from '../utils/storage';

/**
 * Full blog post reader page rendered at '/blog/:id'.
 * Displays post title, author with avatar, creation date, and full content.
 * Shows edit and delete buttons if current user is the author or admin.
 * Delete requires confirmation dialog. On delete, removes post from localStorage and redirects to /blogs.
 * Edit links to /blog/:id/edit.
 * @returns {JSX.Element} The read blog page element.
 */
export default function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const posts = getPosts();
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-secondary-50">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-16 rounded-lg border border-secondary-200 bg-white">
            <div className="text-5xl mb-4 select-none">🔍</div>
            <h2 className="text-xl font-semibold text-secondary-700 mb-2">
              Post Not Found
            </h2>
            <p className="text-sm text-secondary-500 mb-6 max-w-md mx-auto">
              The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
            >
              ← Back to Blogs
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const canEdit =
    session &&
    (session.role === 'admin' || session.userId === post.authorId);

  const authorRole =
    session && session.userId === post.authorId && session.role === 'admin'
      ? 'admin'
      : 'user';

  /**
   * Format an ISO date string to a readable format.
   * @param {string} isoString - ISO date string.
   * @returns {string} Formatted date string.
   */
  function formatDate(isoString) {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  }

  /**
   * Handle post deletion after confirmation.
   * Removes the post from localStorage and navigates to /blogs.
   */
  function handleDelete() {
    try {
      const currentPosts = getPosts();
      const updatedPosts = currentPosts.filter((p) => p.id !== post.id);
      savePosts(updatedPosts);
      navigate('/blogs', { replace: true });
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-secondary-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-1 text-sm font-medium text-secondary-500 hover:text-primary-600 transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Blogs
          </Link>
        </div>

        <article className="rounded-lg border border-secondary-200 bg-white shadow-sm p-6 sm:p-8">
          <header className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-4">
              {post.title}
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                {getAvatar(authorRole)}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-secondary-700">
                    {post.authorName}
                  </span>
                  <span className="text-xs text-secondary-400">
                    {formatDate(post.createdAt)}
                  </span>
                </div>
              </div>

              {canEdit && (
                <div className="flex items-center gap-2">
                  <Link
                    to={`/blog/${post.id}/edit`}
                    className="inline-flex items-center gap-1 rounded-md border border-secondary-300 bg-white px-3 py-1.5 text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
                    aria-label={`Edit ${post.title}`}
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center gap-1 rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
                    aria-label={`Delete ${post.title}`}
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </header>

          <div className="border-t border-secondary-100 pt-6">
            <div className="prose prose-secondary max-w-none text-secondary-700 text-base leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>
        </article>
      </main>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-lg border border-secondary-200 bg-white p-6 shadow-lg">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-2xl mb-4 select-none">
                🗑️
              </div>
              <h2 className="text-lg font-semibold text-secondary-900 mb-2">
                Delete Post
              </h2>
              <p className="text-sm text-secondary-500">
                Are you sure you want to delete &quot;{post.title}&quot;? This action
                cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="inline-flex items-center rounded-md border border-secondary-300 bg-white px-4 py-2 text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}