/* eslint-disable @typescript-eslint/no-explicit-any */
// Add this function to your api.ts file

/**
 * Check if the user is currently logged in
 * @returns {boolean} True if the user is logged in, false otherwise
 */
export const isLoggedIn = (): boolean => {
  const token = localStorage.getItem('token');
  console.log('Token is:', token);
  return token !== undefined && token !== null;
};

/**
 * Get the current user data from localStorage
 * @returns {object|null} User object if logged in, null otherwise
 */
export const getCurrentUser = (): any | null => {
  // First check if the user is logged in
  if (!isLoggedIn()) {
    return null;
  }

  try {
    // Try to get user data from localStorage
    const userString = localStorage.getItem('user');
    if (!userString) {
      return null;
    }

    // Parse the user data
    return JSON.parse(userString);
  } catch (error) {
    // If there's an error (e.g., invalid JSON), return null
    console.error('Error parsing user data:', error);
    return null;
  }
};
