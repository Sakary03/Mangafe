import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { HomeOutlined, LoginOutlined } from '@ant-design/icons';
import { logoutUser } from '../../libs/api';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const UserHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logout button clicked');
    logoutUser();
    navigate('/auth/login');
  };

  return (
    <Header className="fixed top-0 left-0 w-full z-50 bg-white px-6 shadow flex items-center justify-between">
      {/* Logo & Name */}
      <div className="flex items-center gap-2 text-teal-600">
        <HomeOutlined className="text-xl" />
        <span className="text-xl font-semibold">Mangaka</span>
      </div>

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

        <Button
          icon={<LoginOutlined />}
          type="primary"
          onClick={handleLogout} // Correct placement of onClick handler
        >
          Logout
        </Button>
      </div>
    </Header>
  );
};

export default UserHeader;
