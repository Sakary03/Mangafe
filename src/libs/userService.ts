/* eslint-disable @typescript-eslint/no-explicit-any */
// Add this function to your api.ts file

import api from "./api";

/**
 * Check if the user is currently logged in
 * @returns {boolean} True if the user is logged in, false otherwise
 */
export const isLoggedIn = (): boolean => {
  const token = localStorage.getItem('token');
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


export interface RegistrationFormData {
  username: string;
  email: string;
  password: string;
  name: string;
  date: string;
  address: string;
  role: string;
  avatar: string;
}



export const registerUser = async (formData: RegistrationFormData) => {
  const response = await api.post(
    `/auth/register`,
    formData,
  );
  return response;
} 

export const getMyInfo = async () => {
  const response =await JSON.parse(localStorage.getItem('user') || '{}');
  console.log('User info:', response);
  return response;
} 


export interface UserResponse {
  id: number;
  fullName: string;
  userName: string;
  email: string;
  dob: string;
  password: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
  role: string;
}

export interface PaginatedResponse {
  data: UserResponse[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Get all users with pagination and sorting
 * @param offset - Number of records to skip
 * @param limit - Maximum number of records to return
 * @param sortField - Field to sort by
 * @returns Paginated list of users
 */
export const getAllUsersPaginated = async (
  offset: number = 0,
  limit: number = 10,
  sortField: string = 'createdAt'
): Promise<PaginatedResponse> => {
  const response = await api.get('/user/get-all', {
    params: {
      offset,
      limit,
      sortField
    }
  });
  
  // If the backend doesn't return a paginated response structure,
  // we'll format it ourselves
  if (Array.isArray(response.data)) {
    return {
      data: response.data as UserResponse[],
      total: response.data.length, // This would be better if the backend provided a total count
      page: Math.floor(offset / limit) + 1,
      limit
    };
  }
  
  return response.data as PaginatedResponse;
};

/**
 * Get all users in the system (for stats)
 * @returns All users in the system
 */
export const getAllUsersForStats = async (): Promise<UserResponse[]> => {
  const response = await api.get('/user/get-all', {
    params: {
      offset: 0,
      limit: 10000, // Set a very high limit to get all users
      sortField: 'id'
    }
  });
  
  if (Array.isArray(response.data)) {
    return response.data as UserResponse[];
  }
  
  return response.data.data as UserResponse[];
};

/**
 * Get a specific user by their ID
 * @param userId - The ID of the user
 * @returns User data
 */
export const getUserById = async (userId: number): Promise<UserResponse> => {
  const response = await api.get(`/user/me/${userId}`);
  return response.data as UserResponse;
};

/**
 * Delete a user
 * @param userId - The ID of the user to delete
 * @returns Success response
 */
export const deleteUser = async (userId: number) => {
  const response = await api.delete(`/user/${userId}`);
  return response.data;
};

/**
 * Update a user
 * @param userId - The ID of the user to update
 * @param userData - User data to update
 * @returns Updated user data
 */
export const updateUser = async (userId: number, userData: FormData) => {
  const response = await api.put(`/user/${userId}`, userData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Add a new user
 * @param userData - Form data containing user information and avatar
 * @returns Created user data
 */
export const addUser = async (userData: FormData) => {
  const response = await api.post('/user/register', userData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}