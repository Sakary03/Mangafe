import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert, message } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../../libs/api';
import PasswordResetInstructions from '../../components/common/PasswordResetInstructions';

const { Title, Text, Paragraph } = Typography;

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const onFinish = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      await requestPasswordReset(values.email);
      setIsEmailSent(true);
      message.success('Password reset email sent successfully');
    } catch (err: unknown) {
      console.error('Password reset request failed:', err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to send reset email. Please try again.';
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
            Forgot Password
          </Title>
          <Text className="text-gray-500">
            Enter your email to receive password reset instructions
          </Text>
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

        {isEmailSent ? (
          <div className="text-center">
            <Alert
              message="Reset Email Sent"
              description={
                <Paragraph>
                  A password reset link has been sent to your email address.
                  Please check your inbox and follow the instructions to reset
                  your password. The link will expire in 30 minutes.
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
              Return to Login
            </Button>
          </div>
        ) : (
          <>
            <PasswordResetInstructions />
            <Form
              form={form}
              name="forgotPassword"
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
              requiredMark={false}
              size="large"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Enter your email"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full rounded-lg bg-blue-500 hover:bg-blue-600"
                  loading={isLoading}
                >
                  Send Reset Link
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
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
