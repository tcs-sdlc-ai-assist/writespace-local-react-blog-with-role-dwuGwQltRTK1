import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { getAvatar } from './Avatar';

describe('Avatar', () => {
  describe('getAvatar("admin")', () => {
    it('renders a crown emoji for admin role', () => {
      const { container } = render(getAvatar('admin'));
      const span = container.querySelector('span');
      expect(span).toBeInTheDocument();
      expect(span.textContent).toBe('👑');
    });

    it('has violet background classes for admin role', () => {
      const { container } = render(getAvatar('admin'));
      const span = container.querySelector('span');
      expect(span).toHaveClass('bg-violet-200');
      expect(span).toHaveClass('text-violet-800');
    });

    it('has the correct aria-label for admin avatar', () => {
      render(getAvatar('admin'));
      const avatar = screen.getByRole('img', { name: 'Admin avatar' });
      expect(avatar).toBeInTheDocument();
    });

    it('has rounded-full and sizing classes for admin avatar', () => {
      const { container } = render(getAvatar('admin'));
      const span = container.querySelector('span');
      expect(span).toHaveClass('rounded-full');
      expect(span).toHaveClass('w-8');
      expect(span).toHaveClass('h-8');
    });
  });

  describe('getAvatar("user")', () => {
    it('renders a book emoji for user role', () => {
      const { container } = render(getAvatar('user'));
      const span = container.querySelector('span');
      expect(span).toBeInTheDocument();
      expect(span.textContent).toBe('📖');
    });

    it('has indigo background classes for user role', () => {
      const { container } = render(getAvatar('user'));
      const span = container.querySelector('span');
      expect(span).toHaveClass('bg-indigo-200');
      expect(span).toHaveClass('text-indigo-800');
    });

    it('has the correct aria-label for user avatar', () => {
      render(getAvatar('user'));
      const avatar = screen.getByRole('img', { name: 'User avatar' });
      expect(avatar).toBeInTheDocument();
    });

    it('has rounded-full and sizing classes for user avatar', () => {
      const { container } = render(getAvatar('user'));
      const span = container.querySelector('span');
      expect(span).toHaveClass('rounded-full');
      expect(span).toHaveClass('w-8');
      expect(span).toHaveClass('h-8');
    });
  });

  describe('getAvatar with unexpected role', () => {
    it('returns user avatar (book emoji with indigo background) for unknown role', () => {
      const { container } = render(getAvatar('unknown'));
      const span = container.querySelector('span');
      expect(span).toBeInTheDocument();
      expect(span.textContent).toBe('📖');
      expect(span).toHaveClass('bg-indigo-200');
      expect(span).toHaveClass('text-indigo-800');
    });

    it('returns user avatar when role is undefined', () => {
      const { container } = render(getAvatar(undefined));
      const span = container.querySelector('span');
      expect(span).toBeInTheDocument();
      expect(span.textContent).toBe('📖');
    });
  });

  describe('rendering output', () => {
    it('returns a valid JSX element for admin', () => {
      const element = getAvatar('admin');
      expect(element).toBeDefined();
      expect(element.type).toBe('span');
    });

    it('returns a valid JSX element for user', () => {
      const element = getAvatar('user');
      expect(element).toBeDefined();
      expect(element.type).toBe('span');
    });

    it('admin avatar has inline-flex display class', () => {
      const { container } = render(getAvatar('admin'));
      const span = container.querySelector('span');
      expect(span).toHaveClass('inline-flex');
      expect(span).toHaveClass('items-center');
      expect(span).toHaveClass('justify-center');
    });

    it('user avatar has inline-flex display class', () => {
      const { container } = render(getAvatar('user'));
      const span = container.querySelector('span');
      expect(span).toHaveClass('inline-flex');
      expect(span).toHaveClass('items-center');
      expect(span).toHaveClass('justify-center');
    });
  });
});