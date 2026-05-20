# Deployment

This document covers deployment procedures for the WriteSpace application, including Vercel static SPA deployment, build configuration, environment considerations, and CI/CD guidance.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build Configuration](#build-configuration)
- [Vercel Deployment](#vercel-deployment)
  - [Automatic Deployment via Git](#automatic-deployment-via-git)
  - [Manual Deployment via Vercel CLI](#manual-deployment-via-vercel-cli)
  - [vercel.json Configuration](#verceljson-configuration)
- [Environment Notes](#environment-notes)
- [Other Hosting Platforms](#other-hosting-platforms)
  - [Netlify](#netlify)
  - [GitHub Pages](#github-pages)
  - [Cloudflare Pages](#cloudflare-pages)
- [CI/CD Considerations](#cicd-considerations)
  - [GitHub Actions Example](#github-actions-example)
  - [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have the following:

- **Node.js** v18 or higher
- **npm** v9 or higher
- A production build that completes without errors
- (Optional) [Vercel CLI](https://vercel.com/docs/cli) installed globally for manual deployments

## Build Configuration

WriteSpace uses **Vite 5** as its build tool. The production build is configured in `vite.config.js`:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

### Build Commands

| Command             | Description                              |
| ------------------- | ---------------------------------------- |
| `npm install`       | Install all dependencies                 |
| `npm run build`     | Create a production build in `dist/`     |
| `npm run preview`   | Preview the production build locally     |
| `npm run test`      | Run all tests via Vitest                 |
| `npm run test:watch` | Run tests in watch mode                 |

### Build Output

Running `npm run build` generates a static site in the `dist/` directory:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── vite.svg
```

This output is a fully static single-page application (SPA) that can be served by any static file hosting provider.

---

## Vercel Deployment

### Automatic Deployment via Git

The recommended approach is to connect your Git repository to Vercel for automatic deployments on every push.

1. Push your repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to the [Vercel Dashboard](https://vercel.com/new) and click **Add New Project**.
3. Import your repository and select the WriteSpace project.
4. Vercel will auto-detect the Vite framework. Confirm or set the following build settings:

   | Setting            | Value           |
   | ------------------ | --------------- |
   | **Framework Preset** | Vite           |
   | **Build Command**  | `npm run build` |
   | **Output Directory** | `dist`        |
   | **Install Command** | `npm install`  |

5. Click **Deploy**.

Once connected, Vercel will automatically:

- Deploy the **production** branch (usually `main`) to your production URL.
- Create **preview deployments** for every pull request and branch push.

### Manual Deployment via Vercel CLI

If you prefer deploying from your local machine:

1. Install the Vercel CLI globally:

   ```bash
   npm install -g vercel
   ```

2. Log in to your Vercel account:

   ```bash
   vercel login
   ```

3. Build the project locally:

   ```bash
   npm run build
   ```

4. Deploy the `dist/` directory:

   ```bash
   vercel --prod
   ```

   On first run, the CLI will prompt you to link the project. Accept the defaults or configure as needed.

### vercel.json Configuration

The project includes a `vercel.json` file at the repository root that configures SPA routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Why this is required:**

WriteSpace uses client-side routing via React Router v6. When a user navigates directly to a route like `/blogs` or `/blog/p_abc123`, the hosting server must serve `index.html` instead of returning a 404. The rewrite rule ensures all URL paths are handled by the React application.

**What this rule does:**

- Any request to any path (e.g., `/login`, `/admin/users`, `/blog/p_1/edit`) is rewritten to serve `/index.html`.
- Static assets in the `dist/assets/` directory are still served normally because Vercel serves existing files before applying rewrites.

---

## Environment Notes

### No Server-Side Environment Variables

WriteSpace is a fully client-side application. All data is stored in the browser's `localStorage`. There are no server-side environment variables, API keys, or backend services required for deployment.

### localStorage Keys

The application uses the following `localStorage` keys:

| Key                    | Purpose                        |
| ---------------------- | ------------------------------ |
| `writespace_session`   | Current user session data      |
| `writespace_posts`     | All blog post data             |
| `writespace_users`     | All registered user accounts   |

**Important:** Each user's browser maintains its own independent data store. Data is not shared across browsers or devices.

### Default Admin Account

The platform includes a hard-coded admin account that is always available regardless of `localStorage` state:

- **Username:** `admin`
- **Password:** `admin`

This account cannot be deleted through the user management interface.

### Vite Environment Variables

If you extend the application to use environment variables in the future, Vite requires them to be prefixed with `VITE_` and accessed via `import.meta.env.VITE_*`. Never use `process.env` in client-side code.

Example:

```js
const apiUrl = import.meta.env.VITE_API_URL;
```

Environment variables can be set in Vercel under **Project Settings → Environment Variables**.

---

## Other Hosting Platforms

Since WriteSpace builds to a static `dist/` directory, it can be deployed to any static hosting provider. The key requirement is configuring a catch-all redirect so all routes serve `index.html`.

### Netlify

1. Run `npm run build` to generate the `dist/` directory.
2. Create a `dist/_redirects` file (or add a `netlify.toml` at the project root):

   **`netlify.toml`:**

   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

3. Deploy via the Netlify Dashboard or CLI.

### GitHub Pages

1. Run `npm run build`.
2. Add a `dist/404.html` that is a copy of `dist/index.html` (GitHub Pages serves `404.html` for unknown routes).
3. Deploy the `dist/` directory to the `gh-pages` branch using a tool like `gh-pages`:

   ```bash
   npx gh-pages -d dist
   ```

4. If deploying to a subpath (e.g., `https://username.github.io/writespace/`), set the `base` option in `vite.config.js`:

   ```js
   export default defineConfig({
     plugins: [react()],
     base: '/writespace/',
   });
   ```

### Cloudflare Pages

1. Connect your Git repository in the Cloudflare Pages dashboard.
2. Set the build configuration:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. Cloudflare Pages automatically handles SPA routing for single-page applications — no additional configuration is needed.

---

## CI/CD Considerations

### GitHub Actions Example

Below is a sample GitHub Actions workflow that runs tests and builds the project before deployment:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-and-build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18, 20]

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test

      - name: Build production bundle
        run: npm run build

      - name: Verify dist output exists
        run: |
          test -f dist/index.html
          echo "Build output verified successfully"
```

If you are using Vercel's Git integration, Vercel will automatically build and deploy on every push. The GitHub Actions workflow above is useful for running tests as a quality gate before Vercel deploys.

### Pre-Deployment Checklist

Before deploying a new version, verify the following:

1. **All tests pass:**

   ```bash
   npm run test
   ```

2. **Production build succeeds without errors:**

   ```bash
   npm run build
   ```

3. **Preview the build locally** to verify routing and functionality:

   ```bash
   npm run preview
   ```

4. **Verify SPA routing** by navigating directly to a nested route (e.g., `http://localhost:4173/blogs`) in the preview — it should load correctly without a 404.

5. **Check localStorage behavior** by opening the application in a private/incognito window to confirm the default admin account works and new registrations persist.

6. **Review the `dist/` output** to ensure assets are generated and `index.html` references the correct hashed asset filenames.

---

## Troubleshooting

### 404 Errors on Direct Navigation

**Symptom:** Navigating directly to `/blogs`, `/admin`, or any non-root route returns a 404 error.

**Cause:** The hosting provider is not configured to serve `index.html` for all routes.

**Solution:** Ensure the SPA catch-all rewrite is configured:

- **Vercel:** Verify `vercel.json` exists at the project root with the rewrite rule.
- **Netlify:** Add a `_redirects` file or `netlify.toml` with the redirect rule.
- **Other providers:** Configure a fallback to `index.html` for all routes.

### Blank Page After Deployment

**Symptom:** The deployed site shows a blank white page with no content.

**Cause:** Asset paths may be incorrect, often due to deploying to a subpath.

**Solution:**

1. Open the browser developer console and check for 404 errors on JavaScript or CSS files.
2. If deploying to a subpath, set the `base` option in `vite.config.js`:

   ```js
   export default defineConfig({
     plugins: [react()],
     base: '/your-subpath/',
   });
   ```

3. Rebuild and redeploy.

### Data Not Persisting

**Symptom:** Blog posts or user accounts disappear after closing the browser.

**Cause:** The browser may be in private/incognito mode, or `localStorage` may be disabled or cleared by browser settings.

**Solution:** WriteSpace relies on `localStorage` for all data persistence. Ensure:

- The browser is not in private/incognito mode (some browsers clear `localStorage` on close in this mode).
- No browser extensions are clearing site data automatically.
- The browser's storage quota has not been exceeded.

### Build Failures

**Symptom:** `npm run build` fails with errors.

**Solution:**

1. Ensure Node.js v18+ and npm v9+ are installed:

   ```bash
   node --version
   npm --version
   ```

2. Delete `node_modules` and reinstall:

   ```bash
   rm -rf node_modules
   npm install
   ```

3. Check for syntax errors or import issues in the error output.

4. Run tests to identify broken code:

   ```bash
   npm run test
   ```