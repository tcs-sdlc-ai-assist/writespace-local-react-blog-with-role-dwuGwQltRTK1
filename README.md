# WriteSpace

A modern blogging platform built with React where ideas come to life. Write, share, and discover stories that matter.

## Tech Stack

- **React 18** — UI library
- **React Router v6** — Client-side routing
- **Tailwind CSS 3** — Utility-first styling
- **Vite 5** — Build tool and dev server
- **Vitest** — Unit testing framework
- **Testing Library** — React component testing utilities
- **PropTypes** — Runtime prop validation

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
npm install
```

### Development

Start the local development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build

Create a production build:

```bash
npm run build
```

The output will be in the `dist/` directory.

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Testing

Run all tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Folder Structure

```
writespace/
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── vitest.config.js            # Vitest configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── vercel.json                 # Vercel deployment config
├── src/
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Root component with routing
│   ├── index.css               # Tailwind directives
│   ├── setup-tests.js          # Test setup (jest-dom)
│   ├── components/
│   │   ├── Avatar.jsx          # Role-based avatar component
│   │   ├── Avatar.test.jsx     # Avatar tests
│   │   ├── BlogCard.jsx        # Blog post card component
│   │   ├── Navbar.jsx          # Authenticated navigation bar
│   │   ├── ProtectedRoute.jsx  # Route guard component
│   │   ├── ProtectedRoute.test.jsx
│   │   ├── PublicNavbar.jsx    # Public/guest navigation bar
│   │   ├── StatCard.jsx        # Admin dashboard stat tile
│   │   └── UserRow.jsx         # User management row component
│   ├── pages/
│   │   ├── AdminDashboard.jsx  # Admin dashboard page
│   │   ├── Home.jsx            # Blog list page
│   │   ├── Home.test.jsx       # Home page tests
│   │   ├── LandingPage.jsx     # Public landing page
│   │   ├── LoginPage.jsx       # Login page
│   │   ├── LoginPage.test.jsx  # Login page tests
│   │   ├── ReadBlog.jsx        # Blog reader page
│   │   ├── RegisterPage.jsx    # Registration page
│   │   ├── UserManagement.jsx  # Admin user management page
│   │   └── WriteBlog.jsx       # Blog create/edit page
│   └── utils/
│       ├── auth.js             # Session management (localStorage)
│       ├── auth.test.js        # Auth utility tests
│       ├── storage.js          # Posts and users storage (localStorage)
│       └── storage.test.js     # Storage utility tests
```

## Route Map

### Public Routes

| Path        | Page           | Description                     |
| ----------- | -------------- | ------------------------------- |
| `/`         | LandingPage    | Public landing page with hero   |
| `/login`    | LoginPage      | User login form                 |
| `/register` | RegisterPage   | User registration form          |

### Protected Routes (Authenticated Users)

| Path             | Page      | Description                    |
| ---------------- | --------- | ------------------------------ |
| `/blogs`         | Home      | Blog listing (all posts)       |
| `/blog/:id`      | ReadBlog  | Full blog post reader          |
| `/write`         | WriteBlog | Create a new blog post         |
| `/blog/:id/edit` | WriteBlog | Edit an existing blog post     |

### Admin-Only Routes

| Path           | Page            | Description                  |
| -------------- | --------------- | ---------------------------- |
| `/admin`       | AdminDashboard  | Platform overview and stats  |
| `/admin/users` | UserManagement  | Create and manage users      |

## Usage Guide

### Default Admin Account

The platform includes a hard-coded admin account for initial access:

- **Username:** `admin`
- **Password:** `admin`

### Roles

- **Admin** — Full access to all routes including the admin dashboard and user management. Can edit and delete any blog post.
- **User** — Can browse all posts, create new posts, and edit or delete their own posts.

### Creating a New Account

1. Navigate to `/register` or click **Get Started** on the landing page.
2. Fill in your display name, username, password, and confirm password.
3. Submit the form to create your account and be redirected to the blog list.

### Writing a Blog Post

1. Log in and click **New Post** on the blog list page or admin dashboard.
2. Enter a title and content (up to 5,000 characters).
3. Click **Publish Post** to save and view your new post.

### Editing and Deleting Posts

- Authors can edit or delete their own posts from the blog reader page.
- Admins can edit or delete any post on the platform.

### Managing Users (Admin Only)

1. Navigate to `/admin/users` from the admin dashboard.
2. Use the form to create new users with a chosen role (User or Admin).
3. Delete users from the list. The default admin account and your own account cannot be deleted.

## Data Storage

All data is persisted in the browser's `localStorage`:

- **Session:** `writespace_session`
- **Posts:** `writespace_posts`
- **Users:** `writespace_users`

Clearing your browser's local storage will reset all data.

## Deployment

### Vercel

This project is configured for deployment on [Vercel](https://vercel.com/) with SPA routing support via `vercel.json`.

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Import the project in the [Vercel Dashboard](https://vercel.com/new).
3. Vercel will auto-detect the Vite framework. Confirm the following settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Click **Deploy**.

The included `vercel.json` rewrites all routes to `index.html` for client-side routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Other Platforms

For any static hosting platform (Netlify, GitHub Pages, Cloudflare Pages, etc.):

1. Run `npm run build` to generate the `dist/` directory.
2. Deploy the contents of `dist/` to your hosting provider.
3. Configure a catch-all redirect so all routes serve `index.html` (required for client-side routing).

## License

Private — All rights reserved.