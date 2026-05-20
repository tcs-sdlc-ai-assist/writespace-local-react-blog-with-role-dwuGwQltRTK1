import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { getSession } from '../utils/auth';
import { getPosts, savePosts } from '../utils/storage';

/**
 * Blog create and edit form page.
 * Rendered at '/write' for new posts and '/blog/:id/edit' for editing existing posts.
 * If editing, loads existing post and checks ownership (author or admin).
 * Form has title and content fields with validation and character counter.
 * Cancel button routes back without saving.
 * On submit, saves post to localStorage with authorId, authorName, and timestamps.
 * @returns {JSX.Element} The write/edit blog page element.
 */
export default function WriteBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();

  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  const MAX_CONTENT_LENGTH = 5000;

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const posts = getPosts();
    const existingPost = posts.find((p) => p.id === id);

    if (!existingPost) {
      setNotFound(true);
      return;
    }

    const canEdit =
      session &&
      (session.role === 'admin' || session.userId === existingPost.authorId);

    if (!canEdit) {
      setUnauthorized(true);
      return;
    }

    setTitle(existingPost.title);
    setContent(existingPost.content);
  }, [id, isEditing, session]);

  /**
   * Generate a unique post ID.
   * @returns {string} A unique ID string prefixed with 'p_'.
   */
  function generateId() {
    return 'p_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  /**
   * Handle form submission for creating or editing a blog post.
   * @param {React.FormEvent} e - The form event.
   */
  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      setError(`Content must be ${MAX_CONTENT_LENGTH} characters or less`);
      return;
    }

    setLoading(true);

    try {
      const posts = getPosts();

      if (isEditing) {
        const postIndex = posts.findIndex((p) => p.id === id);

        if (postIndex === -1) {
          setError('Post not found');
          setLoading(false);
          return;
        }

        const existingPost = posts[postIndex];

        const canEdit =
          session &&
          (session.role === 'admin' || session.userId === existingPost.authorId);

        if (!canEdit) {
          setError('You do not have permission to edit this post');
          setLoading(false);
          return;
        }

        posts[postIndex] = {
          ...existingPost,
          title: title.trim(),
          content: content.trim(),
          updatedAt: new Date().toISOString(),
        };

        savePosts(posts);
        navigate(`/blog/${id}`, { replace: true });
      } else {
        const newPost = {
          id: generateId(),
          title: title.trim(),
          content: content.trim(),
          createdAt: new Date().toISOString(),
          authorId: session.userId,
          authorName: session.displayName,
        };

        posts.push(newPost);
        savePosts(posts);
        navigate(`/blog/${newPost.id}`, { replace: true });
      }
    } catch (err) {
      console.error('Failed to save post:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }

  if (notFound) {
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
              The blog post you&apos;re trying to edit doesn&apos;t exist or has been removed.
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

  if (unauthorized) {
    return (
      <div className="min-h-screen flex flex-col bg-secondary-50">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-16 rounded-lg border border-secondary-200 bg-white">
            <div className="text-5xl mb-4 select-none">🔒</div>
            <h2 className="text-xl font-semibold text-secondary-700 mb-2">
              Unauthorized
            </h2>
            <p className="text-sm text-secondary-500 mb-6 max-w-md mx-auto">
              You don&apos;t have permission to edit this post.
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

  return (
    <div className="min-h-screen flex flex-col bg-secondary-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to={isEditing ? `/blog/${id}` : '/blogs'}
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
            {isEditing ? 'Back to Post' : 'Back to Blogs'}
          </Link>
        </div>

        <div className="rounded-lg border border-secondary-200 bg-white shadow-sm p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-secondary-900">
              {isEditing ? 'Edit Post' : 'Create New Post'}
            </h1>
            <p className="mt-2 text-sm text-secondary-500">
              {isEditing
                ? 'Update your blog post below'
                : 'Share your thoughts with the WriteSpace community'}
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-secondary-700 mb-1"
              >
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full rounded-md border border-secondary-300 bg-white px-4 py-2.5 text-sm text-secondary-900 placeholder-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors"
                placeholder="Enter your post title"
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-secondary-700 mb-1"
              >
                Content
              </label>
              <textarea
                id="content"
                name="content"
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="block w-full rounded-md border border-secondary-300 bg-white px-4 py-2.5 text-sm text-secondary-900 placeholder-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors resize-y"
                placeholder="Write your blog post content here..."
              />
              <div className="mt-1 flex justify-end">
                <span
                  className={`text-xs ${
                    content.length > MAX_CONTENT_LENGTH
                      ? 'text-red-600 font-medium'
                      : 'text-secondary-400'
                  }`}
                >
                  {content.length} / {MAX_CONTENT_LENGTH}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-secondary-100">
              <Link
                to={isEditing ? `/blog/${id}` : '/blogs'}
                className="inline-flex items-center rounded-md border border-secondary-300 bg-white px-4 py-2.5 text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-white transition-colors ${
                  loading
                    ? 'bg-primary-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {loading ? (
                  isEditing ? 'Saving…' : 'Publishing…'
                ) : (
                  <>
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {isEditing ? 'Save Changes' : 'Publish Post'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}