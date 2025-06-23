import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Card,
  Descriptions,
  Tag,
  Skeleton,
  Button,
  Typography,
  Divider,
  Row,
  Col,
  Space,
  Image,
  message,
  Input,
  Form,
  DatePicker,
  Upload,
  Modal,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  HomeOutlined,
  SettingOutlined,
  LogoutOutlined,
  EditOutlined,
  SaveOutlined,
  PlusOutlined,
  FileImageOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  getCurrentUser,
  updateUser,
  getUserById,
  changeUserPassword,
} from '../../../../libs/userService';
import { uploadToCloudinary } from '../../../../libs/CloudinaryService';
import { getUserFollowedManga } from '../../../../libs/followService';
import { Link } from 'react-router-dom';
import { handleViewManga, searchManga } from '../../../../libs/mangaServices';

const { Title, Text } = Typography;

interface UserProfile {
  username: string;
  email: string;
  name: string;
  date: string;
  address: string;
  role: string;
  avatar: string;
  createdAt?: string;
  updatedAt?: string;
}

interface FollowedManga {
  id: number;
  title: string;
  overview: string;
  description: string;
  author: string;
  posterUrl: string;
  backgroundUrl: string;
  createdAt: string;
  updatedAt: string;
  genres: string[];
  readTimes: number;
  uploadedBy: number | null;
  status: string;
}

const UserProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [resetPasswordVisible, setResetPasswordVisible] = useState(false);
  const [followedManga, setFollowedManga] = useState<FollowedManga[]>([]);
  const [followLoading, setFollowLoading] = useState(false);
  const [uploadedManga, setUploadedManga] = useState<FollowedManga[]>([]);
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const currentUser = await getCurrentUser();

        const userId = currentUser?.userID || currentUser?.id;

        if (!currentUser || !userId) {
          throw new Error('User not logged in');
        }

        const userData = await getUserById(userId);
        console.log('User data:', userData);
        // Map the API response to our UserProfile interface
        const mappedUser: UserProfile = {
          username: userData.userName,
          email: userData.email,
          name: userData.fullName,
          date: userData.dob,
          address: userData.address || 'HaNoi',
          role: userData.role,
          avatar: userData.avatarUrl,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
        };
        setUser(mappedUser);

        editForm.setFieldsValue({
          username: mappedUser.username,
          email: mappedUser.email,
          name: mappedUser.name,
          date: mappedUser.date ? dayjs(mappedUser.date) : undefined,
          address: mappedUser.address,
        });

        // Fetch user's followed manga
        fetchFollowedManga(userId);
        fetchUploadedManga(userId);
      } catch (error) {
        console.error('Error fetching profile:', error);
        message.error('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [editForm]);

  // Function to fetch user's followed manga
  const fetchFollowedManga = async (userId: number) => {
    try {
      setFollowLoading(true);
      const response = await getUserFollowedManga(userId);
      if (response && response.content) {
        setFollowedManga(response.content);
      }
    } catch (error) {
      console.error('Error fetching followed manga:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  // Function to fetch user's uploaded manga
  const fetchUploadedManga = async (userId: number) => {
    try {
      setUploadLoading(true);
      // Set offset to 0 and limit to 5 for just showing a preview of uploaded manga
      const response = await searchManga({ uploadedBy: userId }, 0, 5);
      // Check if response contains data and set it to state
      if (response) {
        if (Array.isArray(response)) {
          // If response is an array
          setUploadedManga(response);
        } else if (response.content) {
          // If response is paginated with content property
          setUploadedManga(response.content);
        }
      }
    } catch (error) {
      console.error('Error fetching uploaded manga:', error);
    } finally {
      setUploadLoading(false);
    }
  };

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
              <Title level={2} className="mb-0">
                {user.name}
              </Title>
              <Text className="text-gray-500">@{user.username}</Text>
              <div className="mt-4">
                <Tag
                  color={user.role === 'ADMIN' ? 'red' : 'blue'}
                  className="text-sm"
                >
                  {user.role}
                </Tag>
              </div>
            </div>

            <div className="absolute top-6 right-8">
              <Space>
                <Button
                  icon={<EditOutlined />}
                  type="default"
                  onClick={() => setResetPasswordVisible(true)}
                >
                  Reset Password
                </Button>
                <Button icon={<SettingOutlined />} type="default">
                  Settings
                </Button>
                <Link to="/auth/login">
                  <Button icon={<LogoutOutlined />} type="text" danger>
                    Logout
                  </Button>
                </Link>
              </Space>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card
              className="shadow-sm"
              extra={
                editing ? (
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={() => {
                      editForm
                        .validateFields()
                        .then(async values => {
                          try {
                            setLoading(true);
                            const formData = new FormData();

                            formData.append('username', values.username);
                            formData.append('email', values.email);
                            formData.append('name', values.name);
                            formData.append('address', values.address || '');
                            if (values.date) {
                              formData.append(
                                'date',
                                values.date.format('YYYY-MM-DD'),
                              );
                            }

                            if (avatarFile) {
                              try {
                                const cloudinaryResponse =
                                  await uploadToCloudinary(avatarFile as any);

                                formData.append(
                                  'avatar',
                                  cloudinaryResponse.secure_url,
                                );

                                // Also store the avatarUrl for later use
                                const avatarUrl = cloudinaryResponse.secure_url;
                                console.log(
                                  'Avatar uploaded to Cloudinary:',
                                  avatarUrl,
                                );
                              } catch (uploadError) {
                                console.error(
                                  'Failed to upload image to Cloudinary:',
                                  uploadError,
                                );
                                message.error(
                                  'Failed to upload profile image. Please try again.',
                                );
                                throw uploadError;
                              }
                            }

                            const currentUser = getCurrentUser();
                            const userId =
                              currentUser?.userID || currentUser?.id;

                            if (currentUser && userId) {
                              await updateUser(userId, formData);

                              await new Promise(resolve =>
                                setTimeout(resolve, 500),
                              );

                              const refreshedCurrentUser = getCurrentUser();

                              if (refreshedCurrentUser) {
                                setUser({
                                  username: refreshedCurrentUser.userName,
                                  email: refreshedCurrentUser.email,
                                  name: refreshedCurrentUser.fullName,
                                  date: refreshedCurrentUser.dob,
                                  address:
                                    refreshedCurrentUser.address || 'HaNoi',
                                  role: refreshedCurrentUser.role,
                                  avatar: refreshedCurrentUser.avatarUrl,
                                });
                              }

                              message.success('Profile updated successfully!');
                              setEditing(false);
                            } else {
                              throw new Error('User not found');
                            }
                          } catch (error) {
                            console.error('Error updating profile:', error);
                            message.error(
                              'Failed to update profile. Please try again.',
                            );
                          } finally {
                            setLoading(false);
                          }
                        })
                        .catch(info => {
                          console.log('Validate Failed:', info);
                        });
                    }}
                  >
                    Save Changes
                  </Button>
                ) : (
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => setEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )
              }
            >
              <Title level={4} className="mb-6">
                Profile Information
              </Title>
              {editing ? (
                <Form form={editForm} layout="vertical">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Form.Item
                      name="username"
                      label="Username"
                      rules={[
                        { required: true, message: 'Username is required' },
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined className="text-blue-600" />}
                      />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: 'Email is required' },
                        {
                          type: 'email',
                          message: 'Please enter a valid email',
                        },
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined className="text-green-600" />}
                      />
                    </Form.Item>

                    <Form.Item
                      name="name"
                      label="Full Name"
                      rules={[
                        { required: true, message: 'Full name is required' },
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined className="text-purple-600" />}
                      />
                    </Form.Item>

                    <Form.Item name="date" label="Date of Birth">
                      <DatePicker className="w-full" />
                    </Form.Item>

                    <Form.Item
                      name="address"
                      label="Address"
                      className="md:col-span-2"
                    >
                      <Input
                        prefix={<HomeOutlined className="text-red-600" />}
                      />
                    </Form.Item>

                    <Form.Item
                      name="avatar"
                      label="Profile Picture"
                      className="md:col-span-2"
                    >
                      <Upload
                        listType="picture-card"
                        showUploadList={false}
                        beforeUpload={file => {
                          setAvatarFile(file);
                          const reader = new FileReader();
                          reader.readAsDataURL(file);
                          reader.onload = () => {
                            setAvatarPreview(reader.result as string);
                          };
                          return false;
                        }}
                      >
                        {avatarPreview ? (
                          <img
                            src={avatarPreview}
                            alt="avatar"
                            style={{ width: '100%' }}
                          />
                        ) : (
                          <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                          </div>
                        )}
                      </Upload>
                    </Form.Item>
                  </div>
                </Form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <UserOutlined className="text-blue-600 text-lg" />
                      </div>
                      <div>
                        <Text className="text-gray-500 text-sm">Username</Text>
                        <div className="text-gray-900 font-medium">
                          {user.username}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <MailOutlined className="text-green-600 text-lg" />
                      </div>
                      <div>
                        <Text className="text-gray-500 text-sm">Email</Text>
                        <div className="text-gray-900 font-medium">
                          {user.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <UserOutlined className="text-purple-600 text-lg" />
                      </div>
                      <div>
                        <Text className="text-gray-500 text-sm">Full Name</Text>
                        <div className="text-gray-900 font-medium">
                          {user.name}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <CalendarOutlined className="text-orange-600 text-lg" />
                      </div>
                      <div>
                        <Text className="text-gray-500 text-sm">
                          Date of Birth
                        </Text>
                        <div className="text-gray-900 font-medium">
                          {dayjs(user.date).format('MMMM D, YYYY')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg md:col-span-2">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <HomeOutlined className="text-red-600 text-lg" />
                      </div>
                      <div>
                        <Text className="text-gray-500 text-sm">Address</Text>
                        <div className="text-gray-900 font-medium">
                          {'HaNoi'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card className="shadow-sm mb-6">
              <Title level={4} className="mb-4">
                Account Details
              </Title>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Account Status</Text>
                  <Tag color="green">Active</Tag>
                </div>
                <Divider className="my-2" />
                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Member Since</Text>
                  <Text>{dayjs(user.createdAt).format('MMM YYYY')}</Text>
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

            {/* Followed Manga Card - Moved to right column */}
            <Card
              className="shadow-sm"
              title={
                <div className="flex justify-between items-center">
                  <Title level={4} className="mb-0">
                    Manga Following
                  </Title>

                  <Link to="/user/following">
                    <Button type="link">View All</Button>
                  </Link>
                </div>
              }
              loading={followLoading}
            >
              {followedManga.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">
                    You haven't followed any manga yet
                  </p>
                  <Link to="/manga">
                    <Button type="primary" className="mt-4">
                      Browse Manga
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {followedManga.slice(0, 4).map(manga => (
                    <Link
                      to={`/manga/${manga.id}`}
                      key={manga.id}
                      onClick={() => handleViewManga(manga.id)}
                    >
                      <div className="flex items-center space-x-3 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <img
                          src={
                            manga.posterUrl ||
                            'https://placehold.co/60x80/e2e8f0/1e293b?text=No+Image'
                          }
                          alt={manga.title}
                          className="w-12 h-16 object-cover rounded"
                          onError={e => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              'https://placehold.co/60x80/e2e8f0/1e293b?text=Error';
                          }}
                        />
                        <div className="overflow-hidden">
                          <div className="font-medium text-sm truncate">
                            {manga.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {manga.genres?.length > 0
                              ? manga.genres[0]
                              : 'No genre'}{' '}
                            • {manga.readTimes || 0} reads
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* Uploaded Manga Section with modern design */}
        <div className="mt-8">
          <Card
            className="shadow-sm"
            title={
              <div className="flex justify-between items-center">
                <div>
                  <Title level={3} className="mb-0">
                    My Manga Uploads
                  </Title>
                  <Text type="secondary">
                    Manage and track your manga uploads
                  </Text>
                </div>
                <Link to={`/user/${getCurrentUser()?.userID}/uploaded`}>
                  <Button type="primary" icon={<PlusOutlined />}>
                    Upload New
                  </Button>
                </Link>
              </div>
            }
            loading={uploadLoading}
          >
            {uploadedManga.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4 text-gray-400">
                  <FileImageOutlined style={{ fontSize: '48px' }} />
                </div>
                <Title level={5}>You haven't uploaded any manga yet</Title>
                <p className="text-gray-500 mb-6">
                  Start sharing your favorite manga with the community
                </p>
                <Link to="/manga/upload">
                  <Button type="primary" size="large">
                    Upload Your First Manga
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {uploadedManga.slice(0, 4).map(manga => (
                  <div
                    key={manga.id}
                    className="bg-gray-50 rounded-xl p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Link to={`/manga/${manga.id}`}>
                          <img
                            src={
                              manga.posterUrl ||
                              'https://placehold.co/120x160/e2e8f0/1e293b?text=No+Image'
                            }
                            alt={manga.title}
                            className="w-24 h-32 object-cover rounded-lg shadow-sm"
                            onError={e => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                'https://placehold.co/120x160/e2e8f0/1e293b?text=Error';
                            }}
                          />
                        </Link>
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link
                              to={`/manga/${manga.id}`}
                              onClick={() => handleViewManga(manga.id)}
                            >
                              <Title
                                level={5}
                                className="mb-0 hover:text-blue-600 transition-colors"
                              >
                                {manga.title}
                              </Title>
                            </Link>
                            <div className="text-gray-500 text-sm mt-1">
                              by {manga.author}
                            </div>
                          </div>
                          <Tag
                            color={
                              manga.status === 'APPROVED'
                                ? 'green'
                                : manga.status === 'PENDING'
                                ? 'gold'
                                : manga.status === 'REJECTED'
                                ? 'red'
                                : 'default'
                            }
                          >
                            {manga.status}
                          </Tag>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1">
                          {manga.genres.slice(0, 3).map((genre, idx) => (
                            <Tag key={idx} className="mr-1 mb-1">
                              {genre.replace('_', ' ')}
                            </Tag>
                          ))}
                          {manga.genres.length > 3 && (
                            <Tag className="mr-1 mb-1">
                              +{manga.genres.length - 3}
                            </Tag>
                          )}
                        </div>

                        <div className="mt-3 flex justify-between items-center">
                          <div className="text-xs text-gray-500 flex items-center">
                            <span>
                              Created{' '}
                              {dayjs(manga.createdAt).format('MMM D, YYYY')}
                            </span>
                            <div className="w-1 h-1 bg-gray-400 rounded-full mx-2"></div>
                            <span>{manga.readTimes} reads</span>
                          </div>

                          <Space>
                            <Link to={`/manga/edit/${manga.id}`}>
                              <Button
                                type="text"
                                icon={<EditOutlined />}
                                size="small"
                              >
                                Edit
                              </Button>
                            </Link>
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              size="small"
                            >
                              Delete
                            </Button>
                          </Space>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {uploadedManga.length > 4 && (
                  <div className="text-center pt-4">
                    <Link to={`/user/${getCurrentUser()?.userID}/uploaded`}>
                      <Button type="link">
                        View All Uploads ({uploadedManga.length})
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Reset Password Modal */}
      <Modal
        title="Reset Password"
        open={resetPasswordVisible}
        onCancel={() => setResetPasswordVisible(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={async values => {
            try {
              setLoading(true);
              const currentUser = getCurrentUser();

              // Use either userID or id, whichever is available
              const userId = currentUser?.userID || currentUser?.id;

              if (!currentUser || !userId) {
                throw new Error('User not logged in');
              }

              // Call the API to change password
              const response = await changeUserPassword(userId, {
                oldPassword: values.currentPassword,
                newPassword: values.newPassword,
              });

              // Check response
              if (response === true) {
                message.success(
                  'Password changed successfully. You will be logged out.',
                );

                // Wait a moment to show the success message, then log out
                setTimeout(() => {
                  // Clear user data and token
                  localStorage.removeItem('user');
                  localStorage.removeItem('token');

                  // Redirect to login page
                  window.location.href = '/auth/login';
                }, 1500);
              } else {
                message.error(
                  'Failed to change password. Please check your current password and try again.',
                );
              }
            } catch (error) {
              console.error('Error changing password:', error);
              message.error(
                'Failed to change password. Please try again later.',
              );
            } finally {
              setLoading(false);
            }
          }}
        >
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[
              { required: true, message: 'Please enter your current password' },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: 'Please enter your new password' },
              {
                min: 8,
                message: 'Password must be at least 8 characters long',
              },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/,
                message:
                  'Password must include uppercase, lowercase, and number',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            rules={[
              { required: true, message: 'Please confirm your new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The two passwords do not match'),
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item className="flex justify-end">
            <Space>
              <Button onClick={() => setResetPasswordVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Reset Password
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfilePage;
