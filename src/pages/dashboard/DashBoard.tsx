import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Button } from 'antd';
import {
  BookOutlined,
  UserOutlined,
  FileOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../libs/api';
import DashboardLayout from './DashboardLayout';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMangas: 0,
    totalUsers: 0,
    totalChapters: 0,
  });
  const [recentMangas, setRecentMangas] = useState<
    {
      id: number;
      title: string;
      status: string;
      chapterCount: number;
      createdAt: string;
    }[]
  >([]);

  useEffect(() => {
    // In a real app, fetch actual data from your backend
    const fetchData = async () => {
      try {
        setLoading(true);

        // Simulate API calls - replace with real API calls
        // const mangaResponse = await api.get('/manga/?offset=0&limit=5');
        // const usersResponse = await api.get('/users/?offset=0&limit=10');
        // const chaptersResponse = await api.get('/chapters/stats');

        // Mock data for demonstration
        setTimeout(() => {
          setStats({
            totalMangas: 12,
            totalUsers: 4,
            totalChapters: 2,
          });

          setRecentMangas([
            {
              id: 1,
              title: 'One Piece',
              status: 'active',
              chapterCount: 1089,
              createdAt: '2023-06-15',
            },
            {
              id: 2,
              title: 'Naruto',
              status: 'completed',
              chapterCount: 700,
              createdAt: '2023-06-14',
            },
            {
              id: 3,
              title: 'Bleach',
              status: 'active',
              chapterCount: 366,
              createdAt: '2023-06-13',
            },
            {
              id: 4,
              title: 'My Hero Academia',
              status: 'active',
              chapterCount: 392,
              createdAt: '2023-06-12',
            },
            {
              id: 5,
              title: 'Dragon Ball',
              status: 'completed',
              chapterCount: 519,
              createdAt: '2023-06-11',
            },
          ]);

          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'active' ? 'green' : 'blue'}>
          {status === 'active' ? 'Active' : 'Completed'}
        </Tag>
      ),
    },
    {
      title: 'Chapters',
      dataIndex: 'chapterCount',
      key: 'chapterCount',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          size="small"
          onClick={() => navigate(`/admin/manga/${record.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* Stats Cards */}
        <Row gutter={16} className="mb-6">
          <Col xs={24} sm={8}>
            <Card loading={loading}>
              <Statistic
                title="Total Manga"
                value={stats.totalMangas}
                prefix={<BookOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card loading={loading}>
              <Statistic
                title="Total Users"
                value={stats.totalUsers}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card loading={loading}>
              <Statistic
                title="Total Chapters"
                value={stats.totalChapters}
                prefix={<FileOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Recent Manga Table */}
        <Card
          title="Recent Manga"
          extra={
            <Button type="link" onClick={() => navigate('/admin/manga')}>
              View All
            </Button>
          }
          className="mb-6"
        >
          <Table
            dataSource={recentMangas}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={false}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
