import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, clearSession } from '../utils/auth';
import { getAvatar } from './Avatar';

/**
 * Authenticated navigation bar component.
 * Shows WriteSpace logo, role-based nav links (Blogs for all, Dashboard and Users for admin only),
 * avatar chip with display name, logout dropdown, and hamburger toggle for mobile.
 * Uses getSession() and clearSession().
 * @returns {JSX.Element} The authenticated navbar element.
 */
export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const session = getSession();

  /**
   * Toggle the mobile menu open/closed state.
   */
  function toggleMobileMenu() {
    setMobileMenuOpen((prev) => !prev);
  }

  /**
   * Toggle the user dropdown open/closed state.
   */
  function toggleDropdown() {
    setDropdownOpen((prev) => !prev);
  }

  /**
   * Handle logout by clearing session and navigating to login page.
   */
  function handleLogout() {
    clearSession();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  }

  const isAdmin = session && session.role === 'admin';

  return (
    <nav className="bg-white border-b border-secondary-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link
              to="/blogs"
              className="text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
            >
              ✍️ WriteSpace
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/blogs"
              className="text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors"
            >
              Blogs
            </Link>
            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  className="text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/users"
                  className="text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors"
                >
                  Users
                </Link>
              </>
            )}

            {/* Avatar Chip with Dropdown */}
            {session && (
              <div className="relative">
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 rounded-full bg-secondary-100 px-3 py-1.5 hover:bg-secondary-200 transition-colors"
                  aria-label="User menu"
                  aria-expanded={dropdownOpen}
                >
                  {getAvatar(session.role)}
                  <span className="text-sm font-medium text-secondary-700">
                    {session.displayName}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-secondary-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md border border-secondary-200 bg-white shadow-lg z-50">
                    <div className="px-4 py-3 border-b border-secondary-100">
                      <p className="text-sm font-medium text-secondary-900">
                        {session.displayName}
                      </p>
                      <p className="text-xs text-secondary-400">
                        @{session.username}
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center rounded-md p-2 text-secondary-500 hover:bg-secondary-100 hover:text-secondary-700 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-secondary-200 bg-white">
          <div className="px-4 py-3 space-y-3">
            {session && (
              <div className="flex items-center gap-2 rounded-full bg-secondary-100 px-3 py-1.5 w-fit">
                {getAvatar(session.role)}
                <span className="text-sm font-medium text-secondary-700">
                  {session.displayName}
                </span>
              </div>
            )}

            <Link
              to="/blogs"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center rounded-md border border-secondary-300 bg-white px-4 py-2 text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
            >
              Blogs
            </Link>

            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center rounded-md border border-secondary-300 bg-white px-4 py-2 text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/users"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center rounded-md border border-secondary-300 bg-white px-4 py-2 text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
                >
                  Users
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="block w-full text-center rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}