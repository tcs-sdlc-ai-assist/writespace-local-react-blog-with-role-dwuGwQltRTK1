const SESSION_KEY = 'writespace_session';

/**
 * Retrieve the current session from localStorage.
 * @returns {Object|null} The session object, or null if no session or on failure.
 */
export function getSession() {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (data === null) {
      return null;
    }
    const parsed = JSON.parse(data);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    console.error('Failed to read session from localStorage:', error);
    return null;
  }
}

/**
 * Save a session object to localStorage.
 * @param {Object} session - The session object to persist.
 * @returns {boolean} True if saved successfully, false otherwise.
 */
export function setSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return true;
  } catch (error) {
    console.error('Failed to save session to localStorage:', error);
    return false;
  }
}

/**
 * Clear the current session from localStorage.
 * @returns {boolean} True if cleared successfully, false otherwise.
 */
export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear session from localStorage:', error);
    return false;
  }
}