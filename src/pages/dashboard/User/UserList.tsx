/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Space,
  Card,
  Typography,
  Pagination,
  Tag,
  Tooltip,
  message,
  Popconfirm,
  Select,
  Row,
  Col,
  Statistic,
  Avatar,
  Input,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  MailOutlined,
  SafetyOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { getAllUsersPaginated, getAllUsersForStats } from '../../../libs/userService';
import DashboardLayout from '../DashboardLayout';

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

interface UserData {
  id: number;
  fullName: string;
  userName: string;
  email: string;
  dob: string;
  password: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
  role: string;
}

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalAdmins, setTotalAdmins] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageSize, setCurrentPageSize] = useState<number>(10);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [sortField, setSortField] = useState<string>('createdAt');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);

  const fetchUsers = useCallback(async (page = 1, pageSize = 10, sort = 'createdAt', search = '') => {
    try {
      setLoading(true);
      const offset = (page - 1) * pageSize;
      const response = await getAllUsersPaginated(offset, pageSize, sort);
      
      let userData = response.data;
      
      // Apply search filter if search term exists
      if (search.trim()) {
        userData = userData.filter(user => 
          user.fullName.toLowerCase().includes(search.toLowerCase()) ||
          user.userName.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      setUsers(userData);
      setFilteredUsers(userData);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: search.trim() ? userData.length : (response.total || response.data.length),
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTotalStats = useCallback(async () => {
    try {
      const allUsers = await getAllUsersForStats();
      
      setTotalUsers(allUsers.length);
      
      // Calculate total admins
      const admins = allUsers.filter(user => user.role === 'ADMIN').length;
      setTotalAdmins(admins);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      message.error('Failed to load user statistics');
    }
  }, []);

  useEffect(() => {
    fetchUsers(currentPage, currentPageSize, sortField, searchTerm);
  }, [fetchUsers, currentPage, currentPageSize, sortField, searchTerm]);

  useEffect(() => {
    fetchTotalStats(); // Fetch total stats on component mount
  }, [fetchTotalStats]);

  const handleTableChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize && pageSize !== currentPageSize) {
      setCurrentPageSize(pageSize);
    }
  };

  const handleSortChange = (value: string) => {
    setSortField(value);
    // Reset to first page when sorting changes
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Reset to first page when searching
    setCurrentPage(1);
  };

  const handleSearchClear = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleViewUser = (id: number) => {
    navigate(`/user/${id}`);
  };

  const handleEditUser = (id: number) => {
    navigate(`/user/edit/${id}`);
  };

  const handleDeleteUser = async (id: number) => {
    try {
      setLoading(true);
      // Implement your delete functionality here
      console.log('Deleting user with id:', id);
      message.success('User deleted successfully');
      fetchUsers(currentPage, currentPageSize, sortField, searchTerm);
      fetchTotalStats(); // Re-fetch stats after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const getRoleTag = (role: string) => {
    switch(role) {
      case 'ADMIN':
        return <Tag color="red"><SafetyOutlined /> Admin</Tag>;
      case 'USER':
        return <Tag color="blue"><UserOutlined /> User</Tag>;
      default:
        return <Tag color="default">{role}</Tag>;
    }
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatarUrl',
      key: 'avatarUrl',
      render: (avatarUrl: string) => (
        <Avatar src={avatarUrl} size="large" icon={<UserOutlined />} />
      ),
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text: string, record: UserData) => (
        <Link to={`/user/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: 'Username',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => (
        <a href={`mailto:${email}`}><MailOutlined /> {email}</a>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => getRoleTag(role),
      filters: [
        { text: 'Admin', value: 'ADMIN' },
        { text: 'User', value: 'USER' },
      ],
      onFilter: (value: any, record: UserData) => record.role === value,
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dob',
      key: 'dob',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: UserData) => (
        <Space size="small">
          <Tooltip title="View User">
            <Button 
              icon={<UserOutlined />} 
              onClick={() => handleViewUser(record.id)}
            />
          </Tooltip>
          <Tooltip title="Edit User">
            <Button 
              icon={<EditOutlined />} 
              onClick={() => handleEditUser(record.id)}
            />
          </Tooltip>
          <Tooltip title="Delete User">
            <Popconfirm
              title="Are you sure you want to delete this user?"
              onConfirm={() => handleDeleteUser(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <DashboardLayout>
    <div className="user-list-container">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>
          <TeamOutlined /> User Management
        </Title>
        <Space>
          <Search
            placeholder="Search users by name, username, or email"
            allowClear
            value={searchTerm}
            onChange={handleSearchChange}
            onClear={handleSearchClear}
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
          />
          <Select
            defaultValue="createdAt"
            style={{ width: 200 }}
            onChange={handleSortChange}
            value={sortField}
          >
            <Option value="fullName">Sort by Name</Option>
            <Option value="createdAt">Sort by Created Date</Option>
            <Option value="userName">Sort by Username</Option>
            <Option value="role">Sort by Role</Option>
          </Select>
        </Space>
      </div>

      {/* Stats Cards */}
      <Row gutter={16} className="mb-4">
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Users"
              value={totalUsers}
              prefix={<TeamOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Admin Users"
              value={totalAdmins}
              prefix={<SafetyOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Regular Users"
              value={totalUsers - totalAdmins}
              prefix={<UserOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
        <div className="flex justify-end mt-4">
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handleTableChange}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Total ${total} users`}
          />
        </div>
      </Card>
    </div>
    </DashboardLayout>
  );
};

export default UserList;