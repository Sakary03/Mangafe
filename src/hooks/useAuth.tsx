import { login, signup } from '@/api/auth'; // API function to call backend
import { useState } from 'react';

export function useAuth() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({});
  const loginUser = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.userInfo));
      return data.userInfo;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signupUser = async (UserSignupForm: any) => {
    setLoading(true);
    setError('');
    try {
      const data = await signup(UserSignupForm);
      setStatus({
        statusCode: 200,
        messages: 'Signup successful',
      });
      return { data, status };
    } catch (err: any) {
      setStatus({
        statusCode: 400,
        messages: 'Signup successful',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    setError('');
    await localStorage.removeItem('token');
    await localStorage.removeItem('user');
    setStatus({
      statusCode: 200,
      messages: 'Logout successful',
    });
    return status;
  };
  return { logoutUser, signupUser, loginUser, error, loading };
}
