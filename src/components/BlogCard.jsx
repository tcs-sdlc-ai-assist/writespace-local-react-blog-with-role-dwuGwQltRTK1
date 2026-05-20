import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getAvatar } from './Avatar';
import { getSession } from '../utils/auth';

/**
 * Reusable blog post card component.
 * Displays title, excerpt (truncated content), date, author avatar, and accent border.
 * Shows edit icon/link if current user is author or admin.
 * Links to /blog/:id for reading.
 * @param {Object} props
 * @param {Object} props.post - The post object to display.
 * @param {string} props.post.id - The post ID.
 * @param {string} props.post.title - The post title.
 * @param {string} props.post.content - The post content.
 * @param {string} props.post.createdAt - ISO date string of creation.
 * @param {string} props.post.authorId - The author's user ID.
 * @param {string} props.post.authorName - The author's display name.
 * @param {string} [props.accentColor] - Optional Tailwind color for the accent border (e.g. "blue", "indigo", "purple").
 * @returns {JSX.Element} A styled blog post card element.
 */
export function BlogCard({ post, accentColor }) {
  const session = getSession();

  const canEdit =
    session &&
    (session.role === 'admin' || session.userId === post.authorId);

  const accentMap = {
    blue: 'border-l-blue-500',
    indigo: 'border-l-indigo-500',
    purple: 'border-l-purple-500',
    green: 'border-l-green-500',
    red: 'border-l-red-500',
    pink: 'border-l-pink-500',
    amber: 'border-l-amber-500',
  };

  const accentClass = accentMap[accentColor] || accentMap.indigo;

  /**
   * Truncate content to a given max length and append ellipsis.
   * @param {string} text - The text to truncate.
   * @param {number} maxLength - Maximum character length.
   * @returns {string} Truncated text.
   */
  function truncate(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trimEnd() + '…';
  }

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
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  }

  const authorRole = session && session.userId === post.authorId && session.role === 'admin' ? 'admin' : 'user';

  return (
    <div
      className={`rounded-lg border border-secondary-200 bg-white shadow-sm transition-shadow hover:shadow-md border-l-4 ${accentClass} flex flex-col`}
    >
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getAvatar(authorRole)}
            <span className="text-sm font-medium text-secondary-700">
              {post.authorName}
            </span>
          </div>
          <span className="text-xs text-secondary-400">
            {formatDate(post.createdAt)}
          </span>
        </div>

        <Link
          to={`/blog/${post.id}`}
          className="text-lg font-semibold text-secondary-900 hover:text-primary-600 transition-colors mb-2 line-clamp-2"
        >
          {post.title}
        </Link>

        <p className="text-sm text-secondary-500 mb-4 flex-1">
          {truncate(post.content, 150)}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-secondary-100">
          <Link
            to={`/blog/${post.id}`}
            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            Read more →
          </Link>

          {canEdit && (
            <Link
              to={`/blog/${post.id}/edit`}
              className="inline-flex items-center gap-1 text-sm font-medium text-secondary-400 hover:text-primary-600 transition-colors"
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
          )}
        </div>
      </div>
    </div>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    authorId: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
  }).isRequired,
  accentColor: PropTypes.string,
};

BlogCard.defaultProps = {
  accentColor: 'indigo',
};