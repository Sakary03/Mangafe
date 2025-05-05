import React from 'react';
import { Layout, Menu, Button, Space } from 'antd';
import {
  HomeOutlined,
  LoginOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header } = Layout;

const AppHeader = () => {
  return (
    <Header className="fixed top-0 left-0 w-full z-50 bg-white px-6 shadow flex items-center justify-between">
      {/* Logo & Name */}
      <Link to='/' className="flex items-center gap-2 text-teal-600">
        <HomeOutlined className="text-xl" />
        <span className="text-xl font-semibold">Mangaka</span>
      </Link>

      {/* Nav + Buttons */}
      <div className="flex items-center gap-8">
        <Menu
          mode="horizontal"
          className="hidden md:flex"
          items={[
            { key: 'about', label: 'About' },
            { key: 'careers', label: 'Careers' },
            { key: 'history', label: 'History' },
            { key: 'services', label: 'Services' },
            { key: 'projects', label: 'Projects' },
            { key: 'blog', label: 'Blog' },
          ]}
        />

        <Space>
          <Link to="/auth/login">
            <Button icon={<LoginOutlined />} type="primary">
              Login
            </Button>
          </Link>
          <Link to="/auth/register">
          <Button icon={<UserAddOutlined />} className="">
            Register
          </Button>
          </Link>
        </Space>
      </div>
    </Header>
  );
};

export default AppHeader;
