import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Avatar, Dropdown } from 'antd';
import {
  DashboardOutlined,
  BookOutlined,
  FileOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../../libs/api';
import { getCurrentUser } from '../../libs/userService';
const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  // Determine the selected menu key based on current path
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('/dashboard/manga') || path.includes('/admin/manga')) {
      return 'manga';
    } else if (
      path.includes('/dashboard/chapters') ||
      (path.includes('/admin/manga') && path.includes('/chapters'))
    ) {
      return 'chapters';
    } else if (
      path.includes('/dashboard/users') ||
      path.includes('/admin/users')
    ) {
      return 'users';
    } else {
      return 'dashboard';
    }
  };

  const [selectedKey, setSelectedKey] = useState(getSelectedKey());

  // Update selected key whenever location changes
  useEffect(() => {
    setSelectedKey(getSelectedKey());
  }, [location.pathname]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = key => {
    switch (key) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'manga':
        navigate('/dashboard/manga');
        break;
      case 'chapters':
        navigate('/dashboard/chapters');
        break;
      case 'users':
        navigate('/dashboard/users');
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/auth/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/admin/profile'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        style={{
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
          zIndex: 999,
        }}
      >
        <div className="p-4 flex items-center justify-center">
          <Title level={collapsed ? 5 : 4} className="m-0 text-blue-600">
            {collapsed ? 'MA' : 'Mangaka'}
          </Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ borderRight: 0 }}
          onClick={({ key }) => handleMenuClick(key)}
          items={[
            {
              key: 'dashboard',
              icon: <DashboardOutlined />,
              label: 'Dashboard',
            },
            {
              key: 'manga',
              icon: <BookOutlined />,
              label: 'Manga',
            },
            {
              key: 'chapters',
              icon: <FileOutlined />,
              label: 'Chapters',
            },
            {
              key: 'users',
              icon: <UserOutlined />,
              label: 'Users',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          className="p-0 bg-white flex justify-between items-center px-4"
          style={{ boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)' }}
        >
          <div className="trigger" onClick={toggleCollapsed}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div className="flex items-center cursor-pointer">
              <span className="mr-2 hidden md:inline">
                {user?.name || 'Administrator'}
              </span>
              <Avatar icon={<UserOutlined />} />
            </div>
          </Dropdown>
        </Header>
        <Content className="m-6 p-6 bg-white rounded-lg">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
