import type { UserSignupForm } from '@/types/UserSignupForm';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const login = async (email: string, password: string) => {
  console.log('BASE_URL IS', BASE_URL);
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  const data = await response.json();
  return data;
};

export const signup = async (UserSignupForm: UserSignupForm) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(UserSignupForm),
  });
  console.log('Response example: ', response);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Signup failed');
  }
  const data = await response.json();
  console.log('SIGNUP DATA', data);
  return data;
};
