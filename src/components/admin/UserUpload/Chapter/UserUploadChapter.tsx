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
} from 'antd';
import { SearchOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
// Import needed services here

const { Title, Text } = Typography;
const { Option } = Select;

export default function UserUploadChapter() {
  const [loading, setLoading] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchTitle, setSearchTitle] = useState('');

  const fetchData = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      // Implement the chapter search functionality
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chapters:', error);
      message.error('Failed to load chapter data');
      setLoading(false);
    }
  };

  const memoizedFetchData = React.useCallback(fetchData, [
    searchTitle,
    pagination.pageSize,
  ]);

  useEffect(() => {
    memoizedFetchData();
  }, [memoizedFetchData]);

  const handleSearch = () => {
    fetchData(1);
  };

  const handleTableChange = (pagination: any) => {
    memoizedFetchData(pagination.current, pagination.pageSize);
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      // Implement status change API call
      message.success(`Chapter status updated to ${status}`);
      fetchData(pagination.current);
    } catch (error) {
      console.error('Error updating chapter status:', error);
      message.error('Failed to update chapter status');
    }
  };

  const getStatusTag = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'published':
        return <Tag color="green">Published</Tag>;
      case 'pending':
        return <Tag color="orange">Pending</Tag>;
      case 'rejected':
        return <Tag color="red">Rejected</Tag>;
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
      title: 'Chapter',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Manga',
      dataIndex: 'mangaTitle',
      key: 'mangaTitle',
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
      render: (_: string, record: any) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() =>
              window.open(
                `/manga/${record.mangaId}/chapter/${record.id}`,
                '_blank',
              )
            }
          >
            View
          </Button>
          <Select
            value={record.status || 'pending'}
            style={{ width: 120 }}
            onChange={value => handleStatusChange(record.id, value)}
            size="small"
          >
            <Option value="published">Published</Option>
            <Option value="pending">Pending</Option>
            <Option value="rejected">Rejected</Option>
          </Select>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => {
              // Implement delete functionality
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>User Uploaded Chapters</Title>
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <Input
            placeholder="Search by title"
            value={searchTitle}
            onChange={e => setSearchTitle(e.target.value)}
            style={{ width: 250 }}
            prefix={<SearchOutlined />}
            allowClear
          />
          <Button type="primary" onClick={handleSearch}>
            Search
          </Button>
        </Space>
      </Card>

      <Table
        columns={columns}
        dataSource={chapters}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: 1200 }}
      />
    </div>
  );
}
