import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Button } from 'antd';
import {
  BookOutlined,
  UserOutlined,
  FileOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import * as mangaService from '../../libs/mangaServices';
import * as userService from '../../libs/userService';
import * as chapterService from '../../libs/chapterServices';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMangas: 0,
    totalUsers: 0,
    totalChapters: 0,
  });
  const [recentMangas, setRecentMangas] = useState<mangaService.MangaItem[]>(
    [],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [allMangas, allUsers, allChapters] = await Promise.all([
          mangaService.getAllManga(0, 10000, 'createdAt', false),
          userService.getAllUsersForStats(),
          chapterService.getAllChaptersForStats(), 
        ]);

        const totalMangas = Array.isArray(allMangas) ? allMangas.length : 0;
        const totalUsers = Array.isArray(allUsers) ? allUsers.length : 0;
        const totalChapters = allChapters?.data?.length || 0;

        setStats({
          totalMangas,
          totalUsers,
          totalChapters,
        });

        const recentMangasData = Array.isArray(allMangas)
          ? allMangas.slice(0, 10)
          : [];

        setRecentMangas(recentMangasData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats({
          totalMangas: 0,
          totalUsers: 0,
          totalChapters: 0,
        });
        setRecentMangas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const getStatusColor = (status: string) => {
          switch (status?.toUpperCase()) {
            case 'APPROVED':
              return 'green';
            case 'PENDING':
              return 'orange';
            case 'REJECTED':
              return 'red';
            default:
              return 'blue';
          }
        };

        const getStatusText = (status: string) => {
          switch (status?.toUpperCase()) { 
            case 'APPROVED':
              return 'APPROVED';
            case 'PENDING':
              return 'PENDING';
            case 'REJECTED':
              return 'REJECTED';
            case 'HIDDEN':
              return 'HIDDEN';
            case 'DELETED':
              return 'DELETED';
            case 'UPDATE':
              return 'UPDATE';
            default:
              return 'UNKNOWN';
          }
        };

        return (
          <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: unknown, record: mangaService.MangaItem) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          size="small"
          onClick={() => navigate(`/manga/${record.id}`)}
        >
          Xem
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
                title="Tổng số truyện"
                value={stats.totalMangas}
                prefix={<BookOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card loading={loading}>
              <Statistic
                title="Tổng số người dùng"
                value={stats.totalUsers}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card loading={loading}>
              <Statistic
                title="Tổng số chương"
                value={stats.totalChapters}
                prefix={<FileOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Recent Manga Table */}
        <Card
          title="Truyện mới nhất"
          extra={
            <Button type="link" onClick={() => navigate('/admin/manga')}>
              Xem tất cả
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
