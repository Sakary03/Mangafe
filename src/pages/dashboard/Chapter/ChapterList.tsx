/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
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
  Statistic,
  Row,
  Col,
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  ReadOutlined,
  FileOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { getAllChaptersPaginated, getAllChaptersForStats} from '../../../libs/chapterServices';
import DashboardLayout from '../DashboardLayout';

const { Title } = Typography;
const { Option } = Select;

interface ChapterData {
  id: number;
  chapterIndex: number;
  pages: string[];
  title: string;
  readTimes: number;
  createdAt: string;
  updatedAt: string;
}

const ChapterList: React.FC = () => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalChapters, setTotalChapters] = useState<number>(0);
  const [totalReads, setTotalReads] = useState<number>(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [sortField, setSortField] = useState<string>('createdAt');

  const fetchChapters = async (page = 1, pageSize = 10, sort = 'createdAt') => {
    try {
      setLoading(true);
      const offset = (page - 1) * pageSize;
      const response = await getAllChaptersPaginated(offset, pageSize, sort);
      setChapters(response.data);
      console.log('Checking chapters: ', response.data);
      setPagination({
        ...pagination,
        current: page,
        total: response.total || response.data.length,
      });
    } catch (error) {
      console.error('Error fetching chapters:', error);
      message.error('Failed to load chapters');
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalStats = async () => {
    try {
      setLoading(true);
      const allChapters = await getAllChaptersForStats();
      
      setTotalChapters(allChapters.data.length);
      
      // Calculate total reads across all chapters
      const reads = allChapters.data.reduce((sum, chapter) => sum + chapter.readTimes, 0);
      setTotalReads(reads);
    } catch (error) {
      console.error('Error fetching chapter stats:', error);
      message.error('Failed to load chapter statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters(pagination.current, pagination.pageSize, sortField);
    fetchTotalStats(); // Fetch total stats on component mount
  }, [sortField]);

  const handleTableChange = (page: number, pageSize?: number) => {
    fetchChapters(page, pageSize || pagination.pageSize, sortField);
  };

  const handleSortChange = (value: string) => {
    setSortField(value);
  };

  const handleViewChapter = (id: number) => {
    navigate(`/chapter/${id}`);
  };

  const handleEditChapter = (id: number) => {
    navigate(`/chapter/edit/${id}`);
  };

  const handleDeleteChapter = async (id: number) => {
    try {
      setLoading(true);
      // Implement your delete functionality here
      message.success('Chapter deleted successfully');
      fetchChapters(pagination.current, pagination.pageSize, sortField);
    } catch (error) {
      console.error('Error deleting chapter:', error);
      message.error('Failed to delete chapter');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Chapter #',
      dataIndex: 'chapterIndex',
      key: 'chapterIndex',
      sorter: (a: ChapterData, b: ChapterData) =>
        a.chapterIndex - b.chapterIndex,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: ChapterData) => (
        <Link to={`/chapter/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: 'Pages',
      dataIndex: 'pages',
      key: 'pages',
      render: (pages: string[]) => <Tag color="blue">{pages.length} pages</Tag>,
    },
    {
      title: 'Manga',
      dataIndex: 'mangaName',
      key: 'mangaName',
      render: (manga: string) => <Tag color="blue">{manga} pages</Tag>,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: ChapterData) => (
        <Space size="small">
          <Tooltip title="View Chapter">
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleViewChapter(record.id)}
            />
          </Tooltip>
          <Tooltip title="Edit Chapter">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEditChapter(record.id)}
            />
          </Tooltip>
          <Tooltip title="Delete Chapter">
            <Popconfirm
              title="Are you sure you want to delete this chapter?"
              onConfirm={() => handleDeleteChapter(record.id)}
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
    <div className="chapter-list-container">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>
          <BookOutlined /> Manga Chapters
        </Title>
        <Space>
          <Select
            defaultValue="createdAt"
            style={{ width: 200 }}
            onChange={handleSortChange}
          >
            <Option value="chapterIndex">Sort by Chapter Number</Option>
            <Option value="createdAt">Sort by Created Date</Option>
            <Option value="updatedAt">Sort by Updated Date</Option>
            <Option value="readTimes">Sort by Read Count</Option>
          </Select>
          <Button 
            type="primary" 
            onClick={() => navigate('/chapter/add')}
          >
            Add New Chapter
          </Button>
        </Space>
      </div>

      {/* Stats Cards */}
      <Row gutter={16} className="mb-4">
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Chapters"
              value={totalChapters}
              prefix={<FileOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Reads"
              value={totalReads}
              prefix={<ReadOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Average Reads per Chapter"
              value={totalChapters > 0 ? (totalReads / totalChapters).toFixed(2) : 0}
              precision={2}
              prefix={<BookOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={chapters}
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
            showTotal={(total) => `Total ${total} chapters`}
          />
        </div>
      </Card>
    </div>
    </DashboardLayout>
  );
};

export default ChapterList;