import React from 'react';
import PropTypes from 'prop-types';
import { getAvatar } from './Avatar';
import { getSession } from '../utils/auth';

/**
 * User table row/card component for admin user management.
 * Displays avatar, display name, username, role badge, created date, and delete button.
 * Delete is disabled for the hard-coded admin (username 'admin') and for the currently logged-in user.
 * @param {Object} props
 * @param {Object} props.user - The user object to display.
 * @param {string} props.user.id - The user's ID.
 * @param {string} props.user.displayName - The user's display name.
 * @param {string} props.user.username - The user's username.
 * @param {"admin"|"user"} props.user.role - The user's role.
 * @param {string} props.user.createdAt - ISO date string of account creation.
 * @param {Function} props.onDelete - Callback invoked with the user's ID when delete is clicked.
 * @returns {JSX.Element} A styled user row element.
 */
export function UserRow({ user, onDelete }) {
  const session = getSession();

  const isHardCodedAdmin = user.username === 'admin';
  const isCurrentUser = session && session.userId === user.id;
  const deleteDisabled = isHardCodedAdmin || isCurrentUser;

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

  /**
   * Get a tooltip message explaining why delete is disabled.
   * @returns {string|undefined} Tooltip text or undefined if delete is enabled.
   */
  function getDeleteTooltip() {
    if (isHardCodedAdmin) {
      return 'Cannot delete the default admin account';
    }
    if (isCurrentUser) {
      return 'Cannot delete your own account';
    }
    return undefined;
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-secondary-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3 min-w-0">
        {getAvatar(user.role)}
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-secondary-900 truncate">
            {user.displayName}
          </span>
          <span className="text-xs text-secondary-400 truncate">
            @{user.username}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        {user.role === 'admin' ? (
          <span className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700">
            Admin
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
            User
          </span>
        )}

        <span className="text-xs text-secondary-400 hidden sm:inline">
          {formatDate(user.createdAt)}
        </span>

        <button
          type="button"
          onClick={() => onDelete(user.id)}
          disabled={deleteDisabled}
          title={getDeleteTooltip()}
          className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            deleteDisabled
              ? 'bg-secondary-100 text-secondary-300 cursor-not-allowed'
              : 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700'
          }`}
          aria-label={`Delete ${user.displayName}`}
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
    </div>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['admin', 'user']).isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};