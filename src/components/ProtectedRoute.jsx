import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getSession } from '../utils/auth';

/**
 * Route guard component that checks session and role before rendering children.
 * @param {Object} props
 * @param {React.ReactNode} props.children - The child components to render if authorized.
 * @param {"admin"|"user"} [props.role] - Optional required role for access.
 * @returns {JSX.Element} The children if authorized, or a Navigate redirect.
 */
export function ProtectedRoute({ children, role }) {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin' && session.role !== 'admin') {
    return <Navigate to="/blogs" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.string,
};

ProtectedRoute.defaultProps = {
  role: undefined,
};