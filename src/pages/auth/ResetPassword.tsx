import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Alert, message } from 'antd';
import { LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { resetPassword } from '../../libs/api';

const { Title, Text, Paragraph } = Typography;

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean>(true);

  useEffect(() => {
    // Extract token from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const tokenParam = searchParams.get('token');

    if (!tokenParam) {
      setTokenValid(false);
      setError(
        'Invalid or missing reset token. Please request a new password reset link.',
      );
    } else {
      setToken(tokenParam);
    }
  }, [location]);

  const onFinish = async (values: ResetPasswordFormValues) => {
    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await resetPassword(token, values.password);
      setIsSuccess(true);
      message.success('Password reset successfully');
    } catch (err: unknown) {
      console.error('Password reset failed:', err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to reset password. The token may be invalid or expired.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
      <div className="w-full max-w-md px-8 py-10 bg-white rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <Title level={2} className="text-gray-800 font-bold">
            Reset Password
          </Title>
          <Text className="text-gray-500">
            Create a new password for your account
          </Text>
          <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-gray-600">
            Password must be at least 6 characters long and include uppercase,
            lowercase, and numbers.
          </div>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            className="mb-6"
            onClose={() => setError(null)}
          />
        )}

        {isSuccess ? (
          <div className="text-center">
            <Alert
              message="Password Reset Successful"
              description={
                <Paragraph>
                  Your password has been reset successfully. You can now log in
                  with your new password.
                </Paragraph>
              }
              type="success"
              showIcon
              className="mb-6"
            />
            <Button
              type="primary"
              size="large"
              className="w-full mt-4"
              onClick={() => navigate('/auth/login')}
            >
              Go to Login
            </Button>
          </div>
        ) : tokenValid ? (
          <Form
            form={form}
            name="resetPassword"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            requiredMark={false}
            size="large"
          >
            <Form.Item
              label="New Password"
              name="password"
              rules={[
                { required: true, message: 'Please enter your new password' },
                { min: 6, message: 'Password must be at least 6 characters' },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
                  message:
                    'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                },
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Enter your new password"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('The passwords do not match'),
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Confirm your new password"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item className="mb-2">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full rounded-lg bg-blue-500 hover:bg-blue-600"
                loading={isLoading}
              >
                Reset Password
              </Button>
            </Form.Item>

            <div className="text-center mt-4">
              <Link
                to="/auth/login"
                className="flex items-center justify-center text-blue-500 hover:text-blue-700"
              >
                <ArrowLeftOutlined className="mr-1" /> Back to Login
              </Link>
            </div>
          </Form>
        ) : (
          <div className="text-center">
            <Button
              type="primary"
              size="large"
              className="w-full mt-4"
              onClick={() => navigate('/auth/forgot-password')}
            >
              Request New Reset Link
            </Button>
            <div className="text-center mt-4">
              <Link
                to="/auth/login"
                className="flex items-center justify-center text-blue-500 hover:text-blue-700"
              >
                <ArrowLeftOutlined className="mr-1" /> Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
