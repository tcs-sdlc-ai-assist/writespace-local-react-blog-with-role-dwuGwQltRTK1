import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import * as storage from '../utils/storage';
import * as auth from '../utils/auth';

describe('Home', () => {
  let getPostsSpy;
  let getSessionSpy;

  beforeEach(() => {
    getPostsSpy = vi.spyOn(storage, 'getPosts');
    getSessionSpy = vi.spyOn(auth, 'getSession');
    getSessionSpy.mockReturnValue({
      userId: 'u_1',
      username: 'jane',
      displayName: 'Jane Doe',
      role: 'user',
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Helper to render Home within a MemoryRouter.
   */
  function renderHome() {
    return render(
      <MemoryRouter initialEntries={['/blogs']}>
        <Home />
      </MemoryRouter>
    );
  }

  describe('when posts exist', () => {
    const mockPosts = [
      {
        id: 'p_1',
        title: 'First Post',
        content: 'This is the first post content.',
        createdAt: '2024-06-01T10:00:00Z',
        authorId: 'u_1',
        authorName: 'Jane Doe',
      },
      {
        id: 'p_2',
        title: 'Second Post',
        content: 'This is the second post content.',
        createdAt: '2024-06-02T12:00:00Z',
        authorId: 'u_2',
        authorName: 'Bob Smith',
      },
      {
        id: 'p_3',
        title: 'Third Post',
        content: 'This is the third post content.',
        createdAt: '2024-06-03T08:00:00Z',
        authorId: 'u_3',
        authorName: 'Alice Johnson',
      },
    ];

    beforeEach(() => {
      getPostsSpy.mockReturnValue(mockPosts);
    });

    it('renders the page heading', () => {
      renderHome();

      expect(screen.getByText('All Posts')).toBeInTheDocument();
    });

    it('renders the subheading text', () => {
      renderHome();

      expect(
        screen.getByText('Browse the latest stories from the community')
      ).toBeInTheDocument();
    });

    it('renders blog card titles for all posts', () => {
      renderHome();

      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
      expect(screen.getByText('Third Post')).toBeInTheDocument();
    });

    it('renders author names for all posts', () => {
      renderHome();

      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      expect(screen.getByText('Bob Smith')).toBeInTheDocument();
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });

    it('renders "Read more" links for each post', () => {
      renderHome();

      const readMoreLinks = screen.getAllByText('Read more →');
      expect(readMoreLinks).toHaveLength(3);
    });

    it('does not render the empty state message', () => {
      renderHome();

      expect(screen.queryByText('No posts yet')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Create Your First Post')
      ).not.toBeInTheDocument();
    });

    it('sorts posts newest first', () => {
      renderHome();

      const titles = screen.getAllByRole('link').filter((link) =>
        mockPosts.some((p) => p.title === link.textContent)
      );

      const titleTexts = titles.map((el) => el.textContent);
      expect(titleTexts.indexOf('Third Post')).toBeLessThan(
        titleTexts.indexOf('Second Post')
      );
      expect(titleTexts.indexOf('Second Post')).toBeLessThan(
        titleTexts.indexOf('First Post')
      );
    });

    it('calls getPosts to load data', () => {
      renderHome();

      expect(getPostsSpy).toHaveBeenCalled();
    });
  });

  describe('when no posts exist', () => {
    beforeEach(() => {
      getPostsSpy.mockReturnValue([]);
    });

    it('renders the empty state heading', () => {
      renderHome();

      expect(screen.getByText('No posts yet')).toBeInTheDocument();
    });

    it('renders the empty state description', () => {
      renderHome();

      expect(
        screen.getByText(
          /It looks like there are no blog posts yet/
        )
      ).toBeInTheDocument();
    });

    it('renders the "Create Your First Post" button', () => {
      renderHome();

      expect(screen.getByText('Create Your First Post')).toBeInTheDocument();
    });

    it('the "Create Your First Post" link points to /write', () => {
      renderHome();

      const createLink = screen.getByText('Create Your First Post').closest('a');
      expect(createLink).toHaveAttribute('href', '/write');
    });

    it('does not render any blog card titles', () => {
      renderHome();

      expect(screen.queryByText('Read more →')).not.toBeInTheDocument();
    });
  });

  describe('New Post button', () => {
    beforeEach(() => {
      getPostsSpy.mockReturnValue([]);
    });

    it('renders the "New Post" button', () => {
      renderHome();

      expect(screen.getByText('New Post')).toBeInTheDocument();
    });

    it('the "New Post" link points to /write', () => {
      renderHome();

      const newPostLink = screen.getByText('New Post').closest('a');
      expect(newPostLink).toHaveAttribute('href', '/write');
    });
  });

  describe('with posts and admin session', () => {
    const mockPosts = [
      {
        id: 'p_1',
        title: 'Admin Post',
        content: 'Content by admin.',
        createdAt: '2024-06-01T10:00:00Z',
        authorId: 'admin',
        authorName: 'Admin',
      },
    ];

    beforeEach(() => {
      getPostsSpy.mockReturnValue(mockPosts);
      getSessionSpy.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });
    });

    it('renders the post title', () => {
      renderHome();

      expect(screen.getByText('Admin Post')).toBeInTheDocument();
    });

    it('shows edit link for admin user on their own post', () => {
      renderHome();

      const editLink = screen.getByLabelText('Edit Admin Post');
      expect(editLink).toBeInTheDocument();
      expect(editLink).toHaveAttribute('href', '/blog/p_1/edit');
    });
  });

  describe('edit visibility for non-owner', () => {
    const mockPosts = [
      {
        id: 'p_1',
        title: 'Other User Post',
        content: 'Content by someone else.',
        createdAt: '2024-06-01T10:00:00Z',
        authorId: 'u_99',
        authorName: 'Other User',
      },
    ];

    beforeEach(() => {
      getPostsSpy.mockReturnValue(mockPosts);
      getSessionSpy.mockReturnValue({
        userId: 'u_1',
        username: 'jane',
        displayName: 'Jane Doe',
        role: 'user',
      });
    });

    it('does not show edit link for posts by other users', () => {
      renderHome();

      expect(screen.queryByLabelText('Edit Other User Post')).not.toBeInTheDocument();
    });
  });
});