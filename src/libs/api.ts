// lib/api.ts
import axios from 'axios';

// Base URL of your backend API
const API_URL = 'http://localhost:9090';

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request if available
api.interceptors.request.use(
  config => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error),
);

// Optional: Handle token expiration globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// ========== AUTH APIs ==========

interface LoginCredentials {
  email: string;
  password: string;
}
interface Credentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {};
}
export const loginUser = async (credentials: LoginCredentials) => {
  localStorage.removeItem('token');
  const response = await api.post('/auth/login', credentials);
  const LoginResponse: LoginResponse = {
    token: response.data.accessToken,
    user: response.data.userInfo,
  };
  console.log('Response:', LoginResponse);
  localStorage.setItem('token', LoginResponse.token);
  localStorage.setItem('user', JSON.stringify(LoginResponse.user)); 

  return LoginResponse;
};

export const registerUser = async (credentials: Credentials) => {
  const response = await api.post('/auth/register', credentials);
  const token = response.data.accessToken;
  localStorage.setItem('token', token);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const logoutUser = () => {
  console.log('User logged out');
  localStorage.removeItem('token');
  console.log(
    'Token removed from localStorage: ',
    localStorage.getItem('token'),
  );
};

export const saveRememberedEmail = (email: string, remember: boolean): void => {
  if (remember) {
    localStorage.setItem('rememberedEmail', email);
  } else {
    localStorage.removeItem('rememberedEmail');
  }
  return;
};

/**
 * Get remembered email if available
 * @returns Remembered email or null
 */
export const getRememberedEmail = (): string | null => {
  return localStorage.getItem('rememberedEmail');
};

export default api;
