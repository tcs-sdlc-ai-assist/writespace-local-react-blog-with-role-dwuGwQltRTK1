import React from 'react';

/**
 * Returns a styled JSX span element representing an avatar based on the user's role.
 * @param {"admin" | "user"} role - The role of the user.
 * @returns {JSX.Element} A styled span element with a role-specific emoji and background color.
 */
export function getAvatar(role) {
  if (role === 'admin') {
    return (
      <span
        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-violet-200 text-violet-800 text-sm font-semibold select-none"
        role="img"
        aria-label="Admin avatar"
      >
        👑
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-200 text-indigo-800 text-sm font-semibold select-none"
      role="img"
      aria-label="User avatar"
    >
      📖
    </span>
  );
}