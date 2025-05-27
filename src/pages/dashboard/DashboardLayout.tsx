import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import {
  DashboardOutlined,
  FileOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReadOutlined,
  UploadOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../../libs/api';
import { getCurrentUser } from '../../libs/userService';
const { Header, Sider, Content } = Layout;

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
    } else if (path.includes('/dashboard/user-manga-uploaded')) {
      return 'userMangaUploaded';
    } else if (path.includes('/dashboard/user-chapter-uploaded')) {
      return 'userChapterUploaded';
    } else {
      return 'dashboard';
    }
  };

  const [selectedKey, setSelectedKey] = useState(getSelectedKey());

  // Update selected key whenever location changes
  useEffect(() => {
    setSelectedKey(getSelectedKey());
  }, [location.pathname, getSelectedKey]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = (key: string) => {
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
      case 'userMangaUploaded':
        navigate('/dashboard/user-manga-uploaded');
        break;
      case 'userChapterUploaded':
        navigate('/dashboard/user-chapter-uploaded');
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
      onClick: () => navigate('/common/profile'),
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
          background: '#fff',
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          transition: 'all 0.25s ease',
        }}
        width={240}
      >
        <div
          className={`p-4 flex items-center ${
            collapsed ? 'justify-center' : 'justify-start pl-6'
          }`}
          style={{
            borderBottom: '1px solid #f0f0f0',
            height: '64px',
            transition: 'all 0.2s',
          }}
        >
          <div className="flex items-center">
            <img
              src="/logo.jpeg"
              alt="Mangaka Logo"
              className={`${collapsed ? 'w-10 h-10' : 'w-8 h-8 mr-3'}`}
              style={{ transition: 'all 0.2s' }}
            />
            {!collapsed && (
              <span
                className="text-blue-600 text-2xl font-bold"
                style={{ letterSpacing: '-0.5px' }}
              >
                Mangaka
              </span>
            )}
          </div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{
            borderRight: 0,
            padding: '8px 0',
          }}
          onClick={({ key }) => handleMenuClick(key)}
          items={[
            {
              key: 'dashboard',
              icon: <DashboardOutlined style={{ fontSize: '18px' }} />,
              label: <span style={{ fontWeight: 500 }}>Dashboard</span>,
              style: {
                margin: '4px 0',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
              },
            },
            {
              type: 'divider',
              style: { margin: '10px 0' },
            },
            {
              type: 'group',
              label: (
                <span
                  style={{ fontSize: '12px', color: '#999', padding: '0 16px' }}
                >
                  CONTENT MANAGEMENT
                </span>
              ),
              children: [
                {
                  key: 'manga',
                  icon: <ReadOutlined style={{ fontSize: '18px' }} />,
                  label: <span style={{ fontWeight: 500 }}>Manga Library</span>,
                  style: {
                    margin: '4px 0',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                  },
                },
                {
                  key: 'chapters',
                  icon: <FileOutlined style={{ fontSize: '18px' }} />,
                  label: <span style={{ fontWeight: 500 }}>Chapters</span>,
                  style: {
                    margin: '4px 0',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                  },
                },
              ],
            },
            {
              type: 'group',
              label: (
                <span
                  style={{ fontSize: '12px', color: '#999', padding: '0 16px' }}
                >
                  USER CONTENT
                </span>
              ),
              children: [
                {
                  key: 'userMangaUploaded',
                  icon: <UploadOutlined style={{ fontSize: '18px' }} />,
                  label: <span style={{ fontWeight: 500 }}>User Manga</span>,
                  style: {
                    margin: '4px 0',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                  },
                },
                {
                  key: 'userChapterUploaded',
                  icon: <UploadOutlined style={{ fontSize: '18px' }} />,
                  label: <span style={{ fontWeight: 500 }}>User Chapters</span>,
                  style: {
                    margin: '4px 0',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                  },
                },
              ],
            },
            {
              type: 'group',
              label: (
                <span
                  style={{ fontSize: '12px', color: '#999', padding: '0 16px' }}
                >
                  ADMINISTRATION
                </span>
              ),
              children: [
                {
                  key: 'users',
                  icon: <TeamOutlined style={{ fontSize: '18px' }} />,
                  label: (
                    <span style={{ fontWeight: 500 }}>User Management</span>
                  ),
                  style: {
                    margin: '4px 0',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                  },
                },
              ],
            },
          ]}
        />
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? '80px' : '240px',
          transition: 'margin 0.25s ease',
        }}
      >
        <Header
          className="p-0 bg-white flex justify-between items-center px-4"
          style={{
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            width: '100%',
          }}
        >
          <div
            className="trigger flex items-center justify-center hover:bg-gray-100"
            onClick={toggleCollapsed}
            style={{
              width: '48px',
              height: '48px',
              cursor: 'pointer',
              borderRadius: '8px',
              transition: 'all 0.2s',
            }}
          >
            {collapsed ? (
              <MenuUnfoldOutlined style={{ fontSize: '18px' }} />
            ) : (
              <MenuFoldOutlined style={{ fontSize: '18px' }} />
            )}
          </div>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div className="flex items-center cursor-pointer">
              <span className="mr-2 hidden md:inline font-medium">
                {user?.name || 'Administrator'}
              </span>
              <Avatar
                icon={<UserOutlined />}
                style={{
                  backgroundColor: '#1890ff',
                  boxShadow: '0 2px 8px rgba(24, 144, 255, 0.15)',
                }}
              />
            </div>
          </Dropdown>
        </Header>
        <Content
          className="m-6 p-6 bg-white rounded-lg"
          style={{
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
            minHeight: 'calc(100vh - 104px)',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
