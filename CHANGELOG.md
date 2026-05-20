# Changelog

All notable changes to the WriteSpace project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-06-01

### Added

- **Public Landing Page** — Hero section with gradient background, feature cards highlighting Write & Publish, Role-Based Access, and Fast & Responsive capabilities, latest posts preview, and footer with navigation links.
- **Authentication Flows**
  - Login page with username and password validation against hard-coded admin account and localStorage users.
  - Registration page with display name, username, password, and confirm password fields including uniqueness checks.
  - Session management via `localStorage` using `writespace_session` key.
  - Automatic redirect for already-authenticated users on login and register pages.
- **Role-Based Access Control**
  - `ProtectedRoute` component guarding authenticated and admin-only routes.
  - Two roles: `admin` (full platform access) and `user` (blog browsing and own post management).
  - Default hard-coded admin account (`admin` / `admin`) available on first use.
- **Blog CRUD Operations**
  - Create new blog posts with title and content fields, character counter (5,000 max), and publish functionality.
  - Read full blog posts with author avatar, display name, and formatted creation date.
  - Edit existing blog posts with ownership and admin permission checks.
  - Delete blog posts with confirmation dialog and localStorage cleanup.
  - Blog listing page with responsive grid layout, sorted newest first, and empty state with call-to-action.
- **Admin Dashboard**
  - Platform overview with stat cards displaying total posts, total users, admin count, and user count.
  - Quick action buttons for creating new posts and managing users.
  - Recent posts section showing up to five latest blog entries.
- **User Management (Admin Only)**
  - Create new users with display name, username, password, and role selection.
  - User list displaying all accounts including the hard-coded admin.
  - Delete users with protection against removing the default admin account and self-deletion.
  - Role badges and avatar indicators for admin and user accounts.
- **Reusable Components**
  - `Navbar` — Authenticated navigation bar with role-based links, avatar chip, logout dropdown, and mobile hamburger menu.
  - `PublicNavbar` — Guest navigation bar with login and registration links, authenticated state detection.
  - `BlogCard` — Blog post card with accent border, truncated excerpt, author avatar, date, and edit link.
  - `StatCard` — Dashboard stat tile with icon, label, value, and color theming.
  - `UserRow` — User management row with avatar, role badge, date, and delete button.
  - `Avatar` — Role-based avatar helper returning styled emoji spans for admin and user roles.
- **localStorage Persistence**
  - Session data stored under `writespace_session`.
  - Blog posts stored under `writespace_posts`.
  - User accounts stored under `writespace_users`.
  - Graceful error handling for storage read/write failures.
- **Responsive UI**
  - Mobile-first design using Tailwind CSS utility classes.
  - Responsive grid layouts for blog cards, stat cards, and form fields.
  - Hamburger navigation menus for mobile viewports on both public and authenticated navbars.
  - Custom color palette with `primary` and `secondary` theme extensions.
- **Vercel Deployment**
  - `vercel.json` configuration with SPA catch-all rewrite for client-side routing support.
  - Production build via Vite outputting to `dist/` directory.
- **Testing**
  - Unit tests for `auth.js` utilities covering session get, set, clear, round-trip persistence, and error handling.
  - Unit tests for `storage.js` utilities covering posts and users CRUD with localStorage mocking.
  - Component tests for `ProtectedRoute` covering unauthenticated redirects, role-based access, and admin authorization.
  - Component tests for `Avatar` covering admin and user role rendering, styling, and edge cases.
  - Page tests for `LoginPage` covering form rendering, validation, successful login flows, invalid credentials, and session redirects.
  - Page tests for `Home` covering post listing, sorting, empty state, edit visibility, and admin permissions.
  - Test setup with Vitest, jsdom environment, and `@testing-library/jest-dom` matchers.