const POSTS_KEY = 'writespace_posts';
const USERS_KEY = 'writespace_users';

/**
 * Retrieve all posts from localStorage.
 * @returns {Array<Object>} Array of post objects, or empty array on failure.
 */
export function getPosts() {
  try {
    const data = localStorage.getItem(POSTS_KEY);
    if (data === null) {
      return [];
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to read posts from localStorage:', error);
    return [];
  }
}

/**
 * Save an array of posts to localStorage.
 * @param {Array<Object>} posts - The posts array to persist.
 * @returns {boolean} True if saved successfully, false otherwise.
 */
export function savePosts(posts) {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    return true;
  } catch (error) {
    console.error('Failed to save posts to localStorage:', error);
    return false;
  }
}

/**
 * Retrieve all users from localStorage.
 * @returns {Array<Object>} Array of user objects, or empty array on failure.
 */
export function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (data === null) {
      return [];
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to read users from localStorage:', error);
    return [];
  }
}

/**
 * Save an array of users to localStorage.
 * @param {Array<Object>} users - The users array to persist.
 * @returns {boolean} True if saved successfully, false otherwise.
 */
export function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Failed to save users to localStorage:', error);
    return false;
  }
}