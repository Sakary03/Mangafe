import React from 'react';
import { Card, Typography, Steps } from 'antd';
import { MailOutlined, SafetyOutlined, LockOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

/**
 * Component that explains the password reset process to users
 */
const PasswordResetInstructions: React.FC = () => {
  return (
    <Card className="mb-6 bg-blue-50">
      <Title level={4} className="text-center mb-4">
        How Password Reset Works
      </Title>
      <Steps
        direction="vertical"
        size="small"
        items={[
          {
            title: 'Request Reset',
            description:
              'Enter your email address to request a password reset link',
            status: 'finish',
            icon: <MailOutlined />,
          },
          {
            title: 'Check Email',
            description:
              'Check your inbox for a reset link (valid for 30 minutes)',
            status: 'wait',
            icon: <SafetyOutlined />,
          },
          {
            title: 'Create New Password',
            description: 'Click the link and set a new secure password',
            status: 'wait',
            icon: <LockOutlined />,
          },
        ]}
      />
      <Text className="block mt-4 text-xs text-gray-500">
        If you don't receive the email within a few minutes, please check your
        spam folder or try again with a different email address.
      </Text>
    </Card>
  );
};

export default PasswordResetInstructions;
