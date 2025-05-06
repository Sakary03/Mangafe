/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Upload, Select, message, Row, Col } from 'antd';
import {
  UploadOutlined,
  UserOutlined,
  MailOutlined,
  LockOutlined,
  HomeOutlined,
  CalendarOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';
import { UserRole } from '../../types/UserRole';
import { uploadToCloudinary } from '../../libs/CloudinaryService';
import { registerUser, RegistrationFormData } from '../../libs/userService';
import { ok } from 'assert';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<RcFile | null>(null);
  const navigate = useNavigate();

  const LAYOUT_IMAGE_URL =
    'https://img.freepik.com/free-photo/view-starry-night-sky-with-nature-mountains-landscape_23-2151614765.jpg?t=st=1746502794~exp=1746506394~hmac=1d135d472a30e800655bea04874f9dfbced869a84de665650e86bc2c179730be&w=1380'; // Replace with your actual image URL

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    setSelectedFile(file);

    return false;
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      let avatarUrl =
        'https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar-thumbnail.png'; // Default avatar

      if (selectedFile) {
        avatarUrl = (await uploadToCloudinary(selectedFile)).secure_url;
      }

      const formattedDate = dayjs(values.date).toISOString();

      const registrationData: RegistrationFormData = {
        username: values.username,
        email: values.email,
        password: values.password,
        name: values.name,
        date: formattedDate,
        address: values.address,
        role: values.role || 'USER',
        avatar: avatarUrl,
      };

      const response = await registerUser(registrationData);

      if (response.status != 200) {
        throw new Error('Registration failed');
      }

      message.success('Registration successful!');
      navigate('/auth/login');
    } catch (error) {
      console.error('Registration error:', error);
      message.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <Row>
            {/* Layout Image Section */}
            <Col xs={0} lg={12}>
              <div
                className="h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${LAYOUT_IMAGE_URL})`,
                  minHeight: '700px',
                }}
              >
                <div className="h-full bg-gradient-to-br from-blue-600/30 to-indigo-600/30 p-12 flex flex-col justify-center backdrop-blur-sm">
                  <h1 className="text-4xl font-bold text-white drop-shadow-md mb-4">
                    Chào mừng bạn đến với Thư Viện Truyện
                  </h1>
                  <p className="text-lg text-white/90 mb-8 max-w-xl">
                    Khám phá hàng ngàn bộ truyện hấp dẫn mọi thể loại. Đăng ký tài khoản để lưu trữ
                    truyện yêu thích và tiếp tục đọc bất cứ lúc nào bạn muốn.
                  </p>
                  <div className="space-y-4 text-white/90">
                    <div className="flex items-center">
                      <svg
                        className="h-6 w-6 mr-2 text-emerald-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Đọc truyện không quảng cáo, không gián đoạn</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="h-6 w-6 mr-2 text-emerald-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Giao diện thân thiện, dễ sử dụng</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="h-6 w-6 mr-2 text-emerald-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Hỗ trợ theo dõi và đánh dấu chương đang đọc</span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            {/* Form Section */}
            <Col xs={24} lg={12}>
              <div className="p-8 lg:p-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  Create Account
                </h2>

                <Form
                  form={form}
                  name="registration"
                  onFinish={onFinish}
                  layout="vertical"
                  requiredMark={false}
                >
                  <div className="flex justify-center mb-8">
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      beforeUpload={beforeUpload}
                    >
                      {previewImage ? (
                        <div className="relative">
                          <img
                            src={previewImage}
                            alt="avatar"
                            className="w-full h-full object-cover rounded-full"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-full">
                            <UploadOutlined className="text-white text-2xl" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center w-28 h-28 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-blue-500 transition-colors">
                          <PlusOutlined className="text-2xl text-gray-400" />
                          <div className="mt-2 text-sm text-gray-500">Upload Photo</div>
                        </div>
                      )}
                    </Upload>
                  </div>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="username"
                        label="Username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                      >
                        <Input
                          prefix={<UserOutlined className="text-gray-400" />}
                          placeholder="Enter username"
                          size="large"
                          className="rounded-lg"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          { required: true, message: 'Please input your email!' },
                          { type: 'email', message: 'Please enter a valid email!' },
                        ]}
                      >
                        <Input
                          prefix={<MailOutlined className="text-gray-400" />}
                          placeholder="Enter email"
                          size="large"
                          className="rounded-lg"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      { required: true, message: 'Please input your password!' },
                      { min: 6, message: 'Password must be at least 6 characters!' },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="text-gray-400" />}
                      placeholder="Enter password"
                      size="large"
                      className="rounded-lg"
                    />
                  </Form.Item>

                  <Form.Item
                    name="name"
                    label="Full Name"
                    rules={[{ required: true, message: 'Please input your full name!' }]}
                  >
                    <Input
                      prefix={<UserOutlined className="text-gray-400" />}
                      placeholder="Enter full name"
                      size="large"
                      className="rounded-lg"
                    />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="date"
                        label="Date of Birth"
                        rules={[{ required: true, message: 'Please select your date of birth!' }]}
                      >
                        <DatePicker
                          className="w-full rounded-lg"
                          prefix={<CalendarOutlined className="text-gray-400" />}
                          placeholder="Select date"
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="role" label="Role" initialValue="USER">
                        <Select size="large" className="rounded-lg">
                          <Select.Option value={UserRole.USER}>User</Select.Option>
                          <Select.Option value={UserRole.ADMIN}>Admin</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="address"
                    label="Address"
                    rules={[{ required: true, message: 'Please input your address!' }]}
                  >
                    <Input
                      prefix={<HomeOutlined className="text-gray-400" />}
                      placeholder="Enter address"
                      size="large"
                      className="rounded-lg"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg"
                    >
                      Create Account
                    </Button>
                  </Form.Item>

                  <div className="text-center mt-4">
                    <span className="text-gray-600">Already have an account? </span>
                    <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                      Sign in
                    </a>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Register;
