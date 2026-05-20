import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNavbar } from '../components/PublicNavbar';
import { BlogCard } from '../components/BlogCard';
import { getPosts } from '../utils/storage';

/**
 * Public landing page component rendered at '/'.
 * Contains hero section with gradient background and CTA buttons,
 * features section with three cards, latest posts preview (up to 3),
 * and footer with links and copyright.
 * @returns {JSX.Element} The landing page element.
 */
export default function LandingPage() {
  const posts = getPosts();

  const sortedPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const accentColors = ['indigo', 'purple', 'blue'];

  const features = [
    {
      icon: '✍️',
      title: 'Write & Publish',
      description:
        'Create and publish blog posts with an intuitive editor. Share your thoughts with the world in just a few clicks.',
    },
    {
      icon: '🔒',
      title: 'Role-Based Access',
      description:
        'Secure role-based access control ensures only authorized users can manage content and platform settings.',
    },
    {
      icon: '⚡',
      title: 'Fast & Responsive',
      description:
        'Built with modern technologies for lightning-fast performance and a seamless experience on any device.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-secondary-50">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Welcome to{' '}
              <span className="text-primary-200">WriteSpace</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-primary-100">
              A modern blogging platform where ideas come to life. Write,
              share, and discover stories that matter.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center rounded-md bg-white px-6 py-3 text-base font-semibold text-primary-700 shadow-sm hover:bg-primary-50 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center rounded-md border border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white hover:bg-white/20 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900">
            Why WriteSpace?
          </h2>
          <p className="mt-4 text-lg text-secondary-500 max-w-2xl mx-auto">
            Everything you need to start your blogging journey, all in one
            place.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-secondary-200 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 text-3xl mb-5 select-none">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-secondary-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="bg-white border-t border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900">
              Latest Posts
            </h2>
            <p className="mt-4 text-lg text-secondary-500 max-w-2xl mx-auto">
              Discover the most recent stories from our community.
            </p>
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
            <div className="text-center py-12 rounded-lg border border-secondary-200 bg-secondary-50">
              <div className="text-4xl mb-4 select-none">📝</div>
              <h3 className="text-lg font-semibold text-secondary-700 mb-2">
                No posts yet
              </h3>
              <p className="text-sm text-secondary-500 mb-6">
                Be the first to share your story on WriteSpace!
              </p>
              <Link
                to="/register"
                className="inline-flex items-center rounded-md bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
              >
                Start Writing
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center">
              <span className="text-xl font-bold text-white">
                ✍️ WriteSpace
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                to="/login"
                className="text-sm text-secondary-400 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm text-secondary-400 hover:text-white transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
          <div className="mt-8 border-t border-secondary-700 pt-8 text-center">
            <p className="text-sm text-secondary-400">
              © {new Date().getFullYear()} WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}