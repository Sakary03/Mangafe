/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Typography, Divider, message, Alert } from 'antd';
import { MailOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { loginUser, getRememberedEmail, saveRememberedEmail } from '../../libs/api';
import { UserRole } from '../../types/UserRole';

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const rememberedEmail = getRememberedEmail();
    if (rememberedEmail) {
      form.setFieldsValue({ email: rememberedEmail, remember: true });
    }
  }, [form]);

  const onFinish = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginUser({
        email: values.email,
        password: values.password,
      });
      saveRememberedEmail(values.email, values.remember);
      message.success('Login successful!');
      if (response.user?.role === UserRole.ADMIN) {
        console.log('Admin login detected');
        await navigate('/dashboard');
        console.log('Navigating to dashboard');
      } else {
        navigate('/');
        window.location.reload();
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
      <div className="w-full max-w-md px-8 py-10 bg-white rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <Title level={2} className="text-gray-800 font-bold">
            Welcome Back
          </Title>
          <Text className="text-gray-500">Please sign in to continue</Text>
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

        <Form
          form={form}
          name="login"
          layout="vertical"
          initialValues={{ remember: false }}
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

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Enter your password"
              iconRender={visible =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              className="rounded-lg"
            />
          </Form.Item>

          <div className="flex justify-between items-center mb-6">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              onClick={() => navigate('/auth/forgot-password')}
            >
              Forgot password?
            </a>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
              className="h-12 rounded-lg font-medium bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </Button>
          </Form.Item>

          <Divider plain>
            <span className="text-gray-400 text-sm">OR</span>
          </Divider>

          <div className="text-center mt-8">
            <Text className="text-gray-600">
              Don't have an account?{' '}
              <a
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => navigate('/auth/register')}
              >
                Sign up
              </a>
            </Text>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
