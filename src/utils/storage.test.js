import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getPosts, savePosts, getUsers, saveUsers } from './storage';

describe('storage.js', () => {
  let getItemSpy;
  let setItemSpy;
  let removeItemSpy;

  beforeEach(() => {
    localStorage.clear();
    getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
    setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getPosts', () => {
    it('returns an empty array when no posts exist in localStorage', () => {
      const result = getPosts();
      expect(result).toEqual([]);
      expect(getItemSpy).toHaveBeenCalledWith('writespace_posts');
    });

    it('returns parsed posts array from localStorage', () => {
      const posts = [
        {
          id: 'p_1',
          title: 'Test Post',
          content: 'Hello world',
          createdAt: '2024-06-01T10:00:00Z',
          authorId: 'u_1',
          authorName: 'Jane',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(posts));

      const result = getPosts();
      expect(result).toEqual(posts);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Test Post');
    });

    it('returns an empty array when localStorage contains corrupted JSON', () => {
      getItemSpy.mockReturnValue('not valid json{{{');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = getPosts();
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('returns an empty array when localStorage contains a non-array value', () => {
      localStorage.setItem('writespace_posts', JSON.stringify({ foo: 'bar' }));

      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage contains a string value', () => {
      localStorage.setItem('writespace_posts', JSON.stringify('hello'));

      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage.getItem throws', () => {
      getItemSpy.mockImplementation(() => {
        throw new Error('Storage unavailable');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = getPosts();
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('savePosts', () => {
    it('saves posts array to localStorage and returns true', () => {
      const posts = [
        {
          id: 'p_1',
          title: 'Test Post',
          content: 'Content',
          createdAt: '2024-06-01T10:00:00Z',
          authorId: 'u_1',
          authorName: 'Jane',
        },
      ];

      const result = savePosts(posts);
      expect(result).toBe(true);
      expect(setItemSpy).toHaveBeenCalledWith(
        'writespace_posts',
        JSON.stringify(posts)
      );

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual(posts);
    });

    it('saves an empty array to localStorage', () => {
      const result = savePosts([]);
      expect(result).toBe(true);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual([]);
    });

    it('returns false when localStorage.setItem throws', () => {
      setItemSpy.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = savePosts([{ id: 'p_1' }]);
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('getUsers', () => {
    it('returns an empty array when no users exist in localStorage', () => {
      const result = getUsers();
      expect(result).toEqual([]);
      expect(getItemSpy).toHaveBeenCalledWith('writespace_users');
    });

    it('returns parsed users array from localStorage', () => {
      const users = [
        {
          id: 'u_1',
          displayName: 'Jane Doe',
          username: 'jane',
          password: 'password123',
          role: 'user',
          createdAt: '2024-06-01T10:00:00Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(users));

      const result = getUsers();
      expect(result).toEqual(users);
      expect(result).toHaveLength(1);
      expect(result[0].username).toBe('jane');
    });

    it('returns an empty array when localStorage contains corrupted JSON', () => {
      getItemSpy.mockImplementation((key) => {
        if (key === 'writespace_users') return '{broken json';
        return null;
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = getUsers();
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('returns an empty array when localStorage contains a non-array value', () => {
      localStorage.setItem('writespace_users', JSON.stringify('not an array'));

      const result = getUsers();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage contains null JSON', () => {
      localStorage.setItem('writespace_users', JSON.stringify(null));

      const result = getUsers();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage.getItem throws', () => {
      getItemSpy.mockImplementation(() => {
        throw new Error('Storage unavailable');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = getUsers();
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('saveUsers', () => {
    it('saves users array to localStorage and returns true', () => {
      const users = [
        {
          id: 'u_1',
          displayName: 'Jane Doe',
          username: 'jane',
          password: 'password123',
          role: 'user',
          createdAt: '2024-06-01T10:00:00Z',
        },
      ];

      const result = saveUsers(users);
      expect(result).toBe(true);
      expect(setItemSpy).toHaveBeenCalledWith(
        'writespace_users',
        JSON.stringify(users)
      );

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toEqual(users);
    });

    it('saves an empty array to localStorage', () => {
      const result = saveUsers([]);
      expect(result).toBe(true);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toEqual([]);
    });

    it('returns false when localStorage.setItem throws', () => {
      setItemSpy.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = saveUsers([{ id: 'u_1' }]);
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('persists multiple users correctly', () => {
      const users = [
        {
          id: 'u_1',
          displayName: 'Jane',
          username: 'jane',
          password: 'pass1',
          role: 'user',
          createdAt: '2024-06-01T10:00:00Z',
        },
        {
          id: 'u_2',
          displayName: 'Bob',
          username: 'bob',
          password: 'pass2',
          role: 'admin',
          createdAt: '2024-06-02T10:00:00Z',
        },
      ];

      saveUsers(users);
      const result = getUsers();
      expect(result).toHaveLength(2);
      expect(result[0].username).toBe('jane');
      expect(result[1].username).toBe('bob');
    });
  });

  describe('round-trip persistence', () => {
    it('can save and retrieve posts correctly', () => {
      const posts = [
        {
          id: 'p_1',
          title: 'First',
          content: 'Content 1',
          createdAt: '2024-01-01T00:00:00Z',
          authorId: 'u_1',
          authorName: 'Author 1',
        },
        {
          id: 'p_2',
          title: 'Second',
          content: 'Content 2',
          createdAt: '2024-01-02T00:00:00Z',
          authorId: 'u_2',
          authorName: 'Author 2',
        },
      ];

      savePosts(posts);
      const retrieved = getPosts();
      expect(retrieved).toEqual(posts);
    });

    it('can save and retrieve users correctly', () => {
      const users = [
        {
          id: 'u_1',
          displayName: 'Alice',
          username: 'alice',
          password: 'secret',
          role: 'user',
          createdAt: '2024-01-01T00:00:00Z',
        },
      ];

      saveUsers(users);
      const retrieved = getUsers();
      expect(retrieved).toEqual(users);
    });

    it('overwrites previous data on save', () => {
      const initialPosts = [
        {
          id: 'p_1',
          title: 'Old',
          content: 'Old content',
          createdAt: '2024-01-01T00:00:00Z',
          authorId: 'u_1',
          authorName: 'Author',
        },
      ];
      savePosts(initialPosts);

      const newPosts = [
        {
          id: 'p_2',
          title: 'New',
          content: 'New content',
          createdAt: '2024-02-01T00:00:00Z',
          authorId: 'u_2',
          authorName: 'Author 2',
        },
      ];
      savePosts(newPosts);

      const retrieved = getPosts();
      expect(retrieved).toEqual(newPosts);
      expect(retrieved).toHaveLength(1);
      expect(retrieved[0].id).toBe('p_2');
    });
  });
});