import React, { useState, useEffect } from 'react';
import { Avatar, Card, Descriptions, Tag, Skeleton, Button, Typography, Divider, Row, Col, Space, Image, message } from 'antd';
import { UserOutlined, MailOutlined, CalendarOutlined, HomeOutlined, SettingOutlined, LogoutOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getMyInfo } from '../../libs/userService';
import { userInfo } from 'os';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

interface UserProfile {
  username: string;
  email: string;
  name: string;
  date: string;
  address: string;
  role: string;
  avatar: string;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch user profile
    const fetchUserProfile = async () => {
      try {
        // Replace with your actual API endpoint
        const data = await getMyInfo()
        if (data =='{}') {
          throw new Error('Failed to fetch profile');
        }
        setUser(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        message.error('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Skeleton active avatar />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center">
        <Title level={3}>Unable to load profile</Title>
        <Button type="primary" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            {/* Cover Image */}
            <div className="relative h-48 w-full overflow-hidden">
                <img
                src="https://static.vecteezy.com/system/resources/thumbnails/007/065/607/small_2x/a-beautiful-big-moon-in-a-dark-blue-sky-with-clouds-photo.jpg"
                alt="Moon Sky"
                className="object-cover w-full h-full"
                />
            </div>

            {/* Content */}
            <div className="px-8 py-6 relative">
                {/* Floating Avatar */}
                <div className="absolute -top-16 left-8 z-10">
                <Avatar
                    size={128}
                    src={user.avatar}
                    icon={<UserOutlined />}
                    className="border-4 border-white shadow-lg"
                />
                </div>

                <div className="ml-40">
                <Title level={2} className="mb-0">{user.name}</Title>
                <Text className="text-gray-500">@{user.username}</Text>
                <div className="mt-4">
                    <Tag color={user.role === 'ADMIN' ? 'red' : 'blue'} className="text-sm">
                    {user.role}
                    </Tag>
                </div>
                </div>

                <div className="absolute top-6 right-8">
                <Space>
                    <Button icon={<EditOutlined />} type="default">Edit Profile</Button>
                    <Button icon={<SettingOutlined />} type="default">Settings</Button>
                    <Link to="/auth/login">
                        <Button icon={<LogoutOutlined />} type="text" danger>Logout</Button>
                    </Link>
                </Space>
                </div>
            </div>
            </div>


        {/* Main Content */}
        <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
            <Card className="shadow-sm">
              <Title level={4} className="mb-6">Profile Information</Title>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserOutlined className="text-blue-600 text-lg" />
                    </div>
                    <div>
                      <Text className="text-gray-500 text-sm">Username</Text>
                      <div className="text-gray-900 font-medium">{user.username}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <MailOutlined className="text-green-600 text-lg" />
                    </div>
                    <div>
                      <Text className="text-gray-500 text-sm">Email</Text>
                      <div className="text-gray-900 font-medium">{user.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <UserOutlined className="text-purple-600 text-lg" />
                    </div>
                    <div>
                      <Text className="text-gray-500 text-sm">Full Name</Text>
                      <div className="text-gray-900 font-medium">{user.name}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <CalendarOutlined className="text-orange-600 text-lg" />
                    </div>
                    <div>
                      <Text className="text-gray-500 text-sm">Date of Birth</Text>
                      <div className="text-gray-900 font-medium">{dayjs(user.date).format('MMMM D, YYYY')}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg md:col-span-2">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <HomeOutlined className="text-red-600 text-lg" />
                    </div>
                    <div>
                      <Text className="text-gray-500 text-sm">Address</Text>
                      <div className="text-gray-900 font-medium">{'HaNoi'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} lg={8}>
            <Card className="shadow-sm mb-6">
              <Title level={4} className="mb-4">Quick Stats</Title>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <Text strong className="text-blue-600 text-2xl block">12</Text>
                  <Text className="text-gray-600">Posts</Text>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <Text strong className="text-green-600 text-2xl block">248</Text>
                  <Text className="text-gray-600">Following</Text>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <Text strong className="text-purple-600 text-2xl block">567</Text>
                  <Text className="text-gray-600">Followers</Text>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <Text strong className="text-orange-600 text-2xl block">89</Text>
                  <Text className="text-gray-600">Likes</Text>
                </div>
              </div>
            </Card>

            <Card className="shadow-sm">
              <Title level={4} className="mb-4">Account Details</Title>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Account Status</Text>
                  <Tag color="green">Active</Tag>
                </div>
                <Divider className="my-2" />
                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Member Since</Text>
                  <Text>{dayjs(user.date).format('MMM YYYY')}</Text>
                </div>
                <Divider className="my-2" />
                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Last Login</Text>
                  <Text>{dayjs().format('MMM D, YYYY')}</Text>
                </div>
                <Divider className="my-2" />
                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Account Type</Text>
                  <Tag color={user.role === 'ADMIN' ? 'red' : 'blue'}>
                    {user.role}
                  </Tag>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Activity Timeline */}
        <Card className="shadow-sm mt-8">
          <Title level={4} className="mb-6">Recent Activity</Title>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <EditOutlined className="text-blue-600" />
              </div>
              <div>
                <Text strong>Updated profile picture</Text>
                <div className="text-gray-500 text-sm">2 hours ago</div>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <UserOutlined className="text-green-600" />
              </div>
              <div>
                <Text strong>Followed 5 new users</Text>
                <div className="text-gray-500 text-sm">Yesterday at 2:45 PM</div>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                <SettingOutlined className="text-purple-600" />
              </div>
              <div>
                <Text strong>Changed account settings</Text>
                <div className="text-gray-500 text-sm">3 days ago</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;