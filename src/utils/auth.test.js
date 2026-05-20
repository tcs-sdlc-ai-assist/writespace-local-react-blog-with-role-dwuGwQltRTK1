import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getSession, setSession, clearSession } from './auth';

describe('auth.js', () => {
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

  describe('getSession', () => {
    it('returns null when no session exists in localStorage', () => {
      const result = getSession();
      expect(result).toBeNull();
      expect(getItemSpy).toHaveBeenCalledWith('writespace_session');
    });

    it('returns parsed session object from localStorage', () => {
      const session = {
        userId: 'u_1',
        username: 'jane',
        displayName: 'Jane Doe',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      const result = getSession();
      expect(result).toEqual(session);
      expect(result.userId).toBe('u_1');
      expect(result.username).toBe('jane');
      expect(result.displayName).toBe('Jane Doe');
      expect(result.role).toBe('user');
    });

    it('returns admin session object correctly', () => {
      const session = {
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      const result = getSession();
      expect(result).toEqual(session);
      expect(result.role).toBe('admin');
    });

    it('returns null when localStorage contains corrupted JSON', () => {
      getItemSpy.mockReturnValue('not valid json{{{');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = getSession();
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('returns null when localStorage contains a string value', () => {
      localStorage.setItem('writespace_session', JSON.stringify('hello'));

      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null when localStorage contains a number value', () => {
      localStorage.setItem('writespace_session', JSON.stringify(42));

      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null when localStorage contains null JSON', () => {
      localStorage.setItem('writespace_session', JSON.stringify(null));

      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null when localStorage contains an array', () => {
      localStorage.setItem('writespace_session', JSON.stringify([1, 2, 3]));

      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null when localStorage.getItem throws', () => {
      getItemSpy.mockImplementation(() => {
        throw new Error('Storage unavailable');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = getSession();
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('setSession', () => {
    it('saves session object to localStorage and returns true', () => {
      const session = {
        userId: 'u_1',
        username: 'jane',
        displayName: 'Jane Doe',
        role: 'user',
      };

      const result = setSession(session);
      expect(result).toBe(true);
      expect(setItemSpy).toHaveBeenCalledWith(
        'writespace_session',
        JSON.stringify(session)
      );

      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored).toEqual(session);
    });

    it('saves admin session object to localStorage', () => {
      const session = {
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };

      const result = setSession(session);
      expect(result).toBe(true);

      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored).toEqual(session);
      expect(stored.role).toBe('admin');
    });

    it('overwrites previous session data', () => {
      const firstSession = {
        userId: 'u_1',
        username: 'jane',
        displayName: 'Jane',
        role: 'user',
      };
      const secondSession = {
        userId: 'u_2',
        username: 'bob',
        displayName: 'Bob',
        role: 'admin',
      };

      setSession(firstSession);
      setSession(secondSession);

      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored).toEqual(secondSession);
      expect(stored.username).toBe('bob');
    });

    it('returns false when localStorage.setItem throws', () => {
      setItemSpy.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const session = {
        userId: 'u_1',
        username: 'jane',
        displayName: 'Jane',
        role: 'user',
      };

      const result = setSession(session);
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('clearSession', () => {
    it('removes session from localStorage and returns true', () => {
      const session = {
        userId: 'u_1',
        username: 'jane',
        displayName: 'Jane',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      const result = clearSession();
      expect(result).toBe(true);
      expect(removeItemSpy).toHaveBeenCalledWith('writespace_session');

      const stored = localStorage.getItem('writespace_session');
      expect(stored).toBeNull();
    });

    it('returns true even when no session exists', () => {
      const result = clearSession();
      expect(result).toBe(true);
      expect(removeItemSpy).toHaveBeenCalledWith('writespace_session');
    });

    it('returns false when localStorage.removeItem throws', () => {
      removeItemSpy.mockImplementation(() => {
        throw new Error('Storage unavailable');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = clearSession();
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('round-trip persistence', () => {
    it('can save and retrieve a session correctly', () => {
      const session = {
        userId: 'u_1',
        username: 'jane',
        displayName: 'Jane Doe',
        role: 'user',
      };

      setSession(session);
      const retrieved = getSession();
      expect(retrieved).toEqual(session);
    });

    it('returns null after clearing a session', () => {
      const session = {
        userId: 'u_1',
        username: 'jane',
        displayName: 'Jane Doe',
        role: 'user',
      };

      setSession(session);
      expect(getSession()).toEqual(session);

      clearSession();
      expect(getSession()).toBeNull();
    });

    it('can set a new session after clearing the previous one', () => {
      const firstSession = {
        userId: 'u_1',
        username: 'jane',
        displayName: 'Jane',
        role: 'user',
      };
      const secondSession = {
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };

      setSession(firstSession);
      expect(getSession()).toEqual(firstSession);

      clearSession();
      expect(getSession()).toBeNull();

      setSession(secondSession);
      expect(getSession()).toEqual(secondSession);
    });
  });
});