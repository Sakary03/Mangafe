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

  const fetchUploadedManga = async (userId: number) => {
    try {
      setUploadLoading(true);
      const response = await searchManga({ uploadedBy: userId }, 0, 5);
      if (response) {
        if (Array.isArray(response)) {
          setUploadedManga(response);
        } else if (response.content) {
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
        <Title level={3}>Không thể tải hồ sơ người dùng</Title>
        <Button type="primary" onClick={() => window.location.reload()}>
          Thử lại
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
                  Đổi mật khẩu
                </Button>
                <Link to="/auth/login">
                  <Button icon={<LogoutOutlined />} type="text" danger>
                    Đăng xuất
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
                                  'Không thể tải lên ảnh đại diện. Vui lòng thử lại.',
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

                              message.success('Cập nhật hồ sơ thành công!');
                              setEditing(false);
                            } else {
                              throw new Error('User not found');
                            }
                          } catch (error) {
                            console.error('Error updating profile:', error);
                            message.error(
                              'Không thể cập nhật hồ sơ. Vui lòng thử lại.',
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
                    Lưu thay đổi
                  </Button>
                ) : (
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => setEditing(true)}
                  >
                    Chỉnh sửa hồ sơ
                  </Button>
                )
              }
            >
              <Title level={4} className="mb-6">
                Thông tin cá nhân
              </Title>
              {editing ? (
                <Form form={editForm} layout="vertical">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Form.Item
                      name="username"
                      label="Tên người dùng"
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập tên người dùng',
                        },
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
                        { required: true, message: 'Vui lòng nhập email' },
                        {
                          type: 'email',
                          message: 'Vui lòng nhập email hợp lệ',
                        },
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined className="text-green-600" />}
                      />
                    </Form.Item>

                    <Form.Item
                      name="name"
                      label="Họ tên"
                      rules={[
                        { required: true, message: 'Vui lòng nhập họ tên' },
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined className="text-purple-600" />}
                      />
                    </Form.Item>

                    <Form.Item name="date" label="Ngày sinh">
                      <DatePicker className="w-full" />
                    </Form.Item>

                    <Form.Item
                      name="address"
                      label="Địa chỉ"
                      className="md:col-span-2"
                    >
                      <Input
                        prefix={<HomeOutlined className="text-red-600" />}
                      />
                    </Form.Item>

                    <Form.Item
                      name="avatar"
                      label="Ảnh đại diện"
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
                            <div style={{ marginTop: 8 }}>Tải lên</div>
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
                        <Text className="text-gray-500 text-sm">
                          Tên người dùng
                        </Text>
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
                        <Text className="text-gray-500 text-sm">Họ tên</Text>
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
                        <Text className="text-gray-500 text-sm">Ngày sinh</Text>
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
                        <Text className="text-gray-500 text-sm">Địa chỉ</Text>
                        <div className="text-gray-900 font-medium">
                          {'Hà Nội'}
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
                Thông tin tài khoản
              </Title>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Trạng thái</Text>
                  <Tag color="green">Đang hoạt động</Tag>
                </div>
                <Divider className="my-2" />
                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Thành viên từ</Text>
                  <Text>{dayjs(user.createdAt).format('MMM YYYY')}</Text>
                </div>
                <Divider className="my-2" />
                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Đăng nhập gần đây</Text>
                  <Text>{dayjs().format('DD/MM/YYYY')}</Text>
                </div>
                <Divider className="my-2" />
                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Loại tài khoản</Text>
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
                    Truyện đang theo dõi
                  </Title>

                  <Link to="/user/following">
                    <Button type="link">Xem tất cả</Button>
                  </Link>
                </div>
              }
              loading={followLoading}
            >
              {followedManga.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">Bạn chưa theo dõi truyện nào</p>
                  <Link to="/manga">
                    <Button type="primary" className="mt-4">
                      Khám phá truyện
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
                              'https://placehold.co/60x80/e2e8f0/1e293b?text=Lỗi';
                          }}
                        />
                        <div className="overflow-hidden">
                          <div className="font-medium text-sm truncate">
                            {manga.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {manga.genres?.length > 0
                              ? manga.genres[0]
                              : 'Không có thể loại'}{' '}
                            • {manga.readTimes || 0} lượt đọc
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
                    Truyện đã đăng tải
                  </Title>
                  <Text type="secondary">
                    Quản lý và theo dõi truyện bạn đã đăng tải
                  </Text>
                </div>
                <Link to={`/upload`}>
                  <Button type="primary" icon={<PlusOutlined />}>
                    Đăng tải mới
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
                <Title level={5}>Bạn chưa đăng tải truyện nào</Title>
                <p className="text-gray-500 mb-6">
                  Bắt đầu chia sẻ truyện yêu thích của bạn với cộng đồng
                </p>
                <Link to="/upload">
                  <Button type="primary" size="large">
                    Đăng tải truyện đầu tiên
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
                        </div>{' '}
                        <div className="mt-3 flex justify-between items-center">
                          <div className="text-xs text-gray-500 flex items-center">
                            <span>
                              Đã tạo{' '}
                              {dayjs(manga.createdAt).format('DD/MM/YYYY')}
                            </span>
                            <div className="w-1 h-1 bg-gray-400 rounded-full mx-2"></div>
                            <span>{manga.readTimes} lượt đọc</span>
                          </div>

                          <Space>
                            <Link to={`/user/uploaded`}>
                              <Button
                                type="text"
                                icon={<EditOutlined />}
                                size="small"
                              >
                                Sửa
                              </Button>
                            </Link>
                            <Link to={`/user/uploaded`}>
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
                              >
                                Xóa
                              </Button>
                            </Link>
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
                        Xem tất cả ({uploadedManga.length})
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
        title="Đổi mật khẩu"
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
                  'Đổi mật khẩu thành công. Bạn sẽ được đăng xuất.',
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
                  'Không thể thay đổi mật khẩu. Vui lòng kiểm tra mật khẩu hiện tại và thử lại.',
                );
              }
            } catch (error) {
              console.error('Error changing password:', error);
              message.error(
                'Không thể thay đổi mật khẩu. Vui lòng thử lại sau.',
              );
            } finally {
              setLoading(false);
            }
          }}
        >
          <Form.Item
            label="Mật khẩu hiện tại"
            name="currentPassword"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu hiện tại' },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Hai mật khẩu không khớp'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item className="flex justify-end">
            <Space>
              <Button onClick={() => setResetPasswordVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Đổi mật khẩu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfilePage;
