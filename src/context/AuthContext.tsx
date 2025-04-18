// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  loginUser,
  registerUser,
  getUserProfile,
  logoutUser,
} from '../libs/api';

// Interface for user information
interface UserInfo {
  userID: number;
  username: string;
  name: string;
  dob: string;
  email: string;
  avatar: string;
  role: string;
}

// Interface for login/register credentials
interface Credentials {
  email: string;
  password: string;
}

// Interface for the auth context
interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: Credentials) => Promise<void>;
  register: (credentials: Credentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const userData = await getUserProfile();
          setUser(userData.userInfo || userData); // Handle different response formats
          setError(null);
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
          localStorage.removeItem('token');
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (credentials: Credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const { token, user: userData } = await loginUser(credentials);

      // Handle the structure from your API response
      if (userData.userInfo) {
        setUser(userData.userInfo);
      } else {
        setUser(userData);
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(
        err.response?.data?.message ||
          'Login failed. Please check your credentials.',
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (credentials: Credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const { token, user: userData } = await registerUser(credentials);

      // Handle the structure from your API response
      if (userData.userInfo) {
        setUser(userData.userInfo);
      } else {
        setUser(userData);
      }
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.',
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    logoutUser();
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Context value
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
