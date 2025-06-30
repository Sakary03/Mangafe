import React, { useState, useEffect } from 'react';
import {
  Table,
  Space,
  Button,
  Select,
  Typography,
  Tag,
  message,
  Input,
  Card,
  TablePaginationConfig,
} from 'antd';
import { SearchOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  getAllManga,
  updateMangaStatus,
  deleteManga,
  MangaItem,
} from '../../../../libs/mangaServices';
import { notificationServices } from '../../../../libs/notificationServices';

const { Title, Text } = Typography;
const { Option } = Select;

export default function UserUploadManga() {
  const [loading, setLoading] = useState(false);
  const [manga, setManga] = useState<MangaItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchTitle, setSearchTitle] = useState('');

  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  // Function to create status change notification
  const createStatusChangeNotification = async (
    userId: number,
    mangaTitle: string,
    oldStatus: string,
    newStatus: string,
  ) => {
    try {
      await notificationServices.statusChangeNotification(
        userId,
        mangaTitle,
        oldStatus,
        newStatus,
      );
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const fetchData = async (page = 1, limit = 100) => {
    setLoading(true);
    try {
      const offset = (page - 1) * limit;
      const response = await getAllManga(offset, limit, 'createdAt', false);
      console.log('Checking responseL:', response);
      let filteredData = await response.filter(
        (manga: MangaItem) =>
          manga.uploadedBy && manga.uploadedBy.role !== 'ADMIN',
      );
      console.log('Filtered data:', filteredData);
      if (searchTitle.trim()) {
        filteredData = filteredData.filter((manga: MangaItem) =>
          manga.title.toLowerCase().includes(searchTitle.toLowerCase()),
        );
      }

      if (statusFilter.length > 0) {
        filteredData = filteredData.filter((manga: MangaItem) =>
          statusFilter.includes(manga.status as string),
        );
      }

      setManga(filteredData);
      setPagination({
        ...pagination,
        current: page,
        total: filteredData.length,
      });
    } catch (error) {
      console.error('Error fetching manga:', error);
      message.error('Failed to load manga data');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedFetchData = React.useCallback(fetchData, [
    searchTitle,
    pagination.pageSize,
    statusFilter,
  ]);

  useEffect(() => {
    memoizedFetchData();
  }, [memoizedFetchData]);

  const handleSearch = () => {
    fetchData(1);
  };

  const handleTableChange = (paginationInfo: TablePaginationConfig) => {
    if (paginationInfo.current && paginationInfo.pageSize) {
      memoizedFetchData(paginationInfo.current, paginationInfo.pageSize);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      // Find the manga to get owner info and current status
      const currentManga = manga.find(m => m.id === id);
      if (!currentManga) {
        message.error('Manga not found');
        return;
      }

      const oldStatus = currentManga.status || 'UNKNOWN';

      // Don't send notification if status hasn't changed
      if (oldStatus.toUpperCase() === status.toUpperCase()) {
        message.info('Status is already set to this value');
        return;
      }

      // Update the manga status
      await updateMangaStatus(id, status);

      // Create notification for the manga owner
      if (currentManga.uploadedBy?.id) {
        await createStatusChangeNotification(
          currentManga.uploadedBy.id,
          currentManga.title,
          oldStatus,
          status,
        );
      }

      message.success(`Manga status updated to ${status} and user notified`);
      fetchData(pagination.current);
    } catch (error) {
      console.error('Error updating manga status:', error);
      message.error('Failed to update manga status');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteManga(id);
      message.success('Manga deleted successfully');
      fetchData(pagination.current);
    } catch (error) {
      console.error('Error deleting manga:', error);
      message.error('Failed to delete manga');
    }
  };

  const getStatusTag = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return <Tag color="green">Approved</Tag>;
      case 'PENDING':
        return <Tag color="orange">Pending</Tag>;
      case 'REJECTED':
        return <Tag color="red">Rejected</Tag>;
      case 'HIDDEN':
        return <Tag color="gray">Hidden</Tag>;
      case 'DELETED':
        return <Tag color="black">Deleted</Tag>;
      case 'UPDATE':
        return <Tag color="blue">Update</Tag>;
      default:
        return <Tag color="default">Unknown</Tag>;
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: MangaItem) => (
        <Space>
          <img
            src={record.posterUrl}
            alt={text}
            style={{
              width: 50,
              height: 70,
              objectFit: 'cover',
              borderRadius: 4,
            }}
          />
          <Space direction="vertical" size={0}>
            <Text strong>{text}</Text>
            <Text type="secondary">{record.author}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Genres',
      dataIndex: 'genres',
      key: 'genres',
      render: (genres: string[]) => (
        <Space size={[0, 4]} wrap>
          {(genres || []).map(genre => (
            <Tag key={genre} color="blue">
              {genre}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Uploaded Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: MangaItem) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => window.open(`/manga/${record.id}`, '_blank')}
          >
            View
          </Button>
          <Select
            value={record.status || 'PENDING'}
            style={{ width: 120 }}
            onChange={value => handleStatusChange(record.id, value)}
            size="small"
          >
            <Option value="APPROVED">Approve</Option>
            <Option value="PENDING">Pending</Option>
            <Option value="REJECTED">Reject</Option>
            <Option value="HIDDEN">Hide</Option>
            <Option value="UPDATE">Update</Option>
          </Select>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Truyện người dùng đóng góp</Title>
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="Search by title"
            value={searchTitle}
            onChange={e => setSearchTitle(e.target.value)}
            style={{ width: 250 }}
            prefix={<SearchOutlined />}
            allowClear
          />
          <Select
            mode="multiple"
            placeholder="Filter by status"
            value={statusFilter}
            onChange={values => setStatusFilter(values)}
            style={{ width: 300 }}
            allowClear
          >
            <Option value="PENDING">Pending</Option>
            <Option value="APPROVED">Approved</Option>
            <Option value="REJECTED">Rejected</Option>
            <Option value="HIDDEN">Hidden</Option>
            <Option value="DELETED">Deleted</Option>
            <Option value="UPDATE">Update</Option>
          </Select>
          <Button type="primary" onClick={handleSearch}>
            Search
          </Button>
        </Space>
      </Card>

      <Table
        columns={columns}
        dataSource={manga}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: 1200 }}
      />
    </div>
  );
}
