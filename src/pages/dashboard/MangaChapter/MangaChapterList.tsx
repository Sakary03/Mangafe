/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  Upload,
  message,
  Popconfirm,
  Card,
  Typography,
  List,
  Image,
  Breadcrumb,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  HomeOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams, Link } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import {
  getChapter,
  addChapter,
  updateChapter,
  deleteChapter,
  ChapterResponse,
  getAllChapter,
} from '../../../libs/chapterServices';
import { getMangaById } from '../../../libs/mangaServices';

const { Title, Text } = Typography;
const { Dragger } = Upload;

const MangaChapterList = () => {
  const navigate = useNavigate();
  const { mangaId } = useParams<{ mangaId: string }>();
  const [form] = Form.useForm();

  interface Manga {
    id: number;
    title: string;
    author: string;
  }

  const [manga, setManga] = useState<Manga | null>(null);
  const [chapters, setChapters] = useState<ChapterResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number | null>(
    null,
  );
  const [pageFiles, setPageFiles] = useState<File[]>([]);
  const [previewPages, setPreviewPages] = useState<string[]>([]);
  const [nextChapterIndex, setNextChapterIndex] = useState<number>(1);

  // Fetch manga details and chapters
  const fetchMangaData = async () => {
    if (!mangaId) return;

    try {
      setLoading(true);
      const mangaData = await getMangaById(Number(mangaId));
      setManga(mangaData);

      const chapterList = await getAllChapter(Number(mangaId));

      setChapters(chapterList);
      setNextChapterIndex(chapterList.length + 1);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching manga data:', error);
      message.error('Failed to load manga data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMangaData();
  }, [mangaId]);

  const showAddModal = () => {
    form.resetFields();
    form.setFieldsValue({
      chapterIndex: nextChapterIndex,
      title: `Chapter ${nextChapterIndex}`,
    });
    setPageFiles([]);
    setModalType('add');
    setModalVisible(true);
  };

  const showEditModal = (chapter: ChapterResponse) => {
    form.resetFields();
    form.setFieldsValue({
      chapterIndex: chapter.chapterIndex,
      title: `Chapter ${chapter.chapterIndex}`,
    });
    setCurrentChapterIndex(chapter.chapterIndex);
    setPageFiles([]);
    setModalType('edit');
    setModalVisible(true);
  };

  const showPreviewModal = async (chapterIndex: number) => {
    try {
      setLoading(true);
      // In a real app, fetch chapter data
      const chapterData = await getChapter(Number(mangaId), chapterIndex);
      setPreviewPages(chapterData.pages);
      setPreviewModalVisible(true);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chapter:', error);
      message.error('Failed to load chapter');
      setLoading(false);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (modalType === 'add' && pageFiles.length === 0) {
        message.error('Please upload at least one page');
        return;
      }

      setLoading(true);

      // In a real app, you would upload the images first to get URLs
      // For demonstration, we'll create mock URLs
      const mockPageUrls = pageFiles.map(
        (_, index) =>
          `https://picsum.photos/800/1200?random=${Date.now() + index}`,
      );

      const chapterData = {
        pages: mockPageUrls,
      };

      if (modalType === 'add') {
        await addChapter(Number(mangaId), values.chapterIndex, chapterData);
        message.success('Chapter added successfully');
      } else {
        await updateChapter(Number(mangaId), currentChapterIndex!, chapterData);
        message.success('Chapter updated successfully');
      }

      setModalVisible(false);
      fetchMangaData(); // Refresh the data
    } catch (error) {
      console.error('Error saving chapter:', error);
      message.error('Failed to save chapter');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChapter = async (chapterIndex: number) => {
    try {
      setLoading(true);
      await deleteChapter(Number(mangaId), chapterIndex);
      message.success('Chapter deleted successfully');
      fetchMangaData(); // Refresh the data
    } catch (error) {
      console.error('Error deleting chapter:', error);
      message.error('Failed to delete chapter');
    } finally {
      setLoading(false);
    }
  };

  const handlePageUpload = ({ fileList }: any) => {
    // Store only the raw File objects
    const files = fileList.map((file: any) => {
      if (file.originFileObj) {
        return file.originFileObj;
      }
      return file;
    });
    setPageFiles(files);
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      // Validate file type
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return Upload.LIST_IGNORE;
      }
      return false; // Prevent auto upload
    },
    multiple: true,
    listType: 'picture' as const,
    onChange: handlePageUpload,
  };

  const columns = [
    {
      title: 'Chapter No.',
      dataIndex: 'chapterIndex',
      key: 'chapterIndex',
      sorter: (a: ChapterResponse, b: ChapterResponse) =>
        a.chapterIndex - b.chapterIndex,
    },
    {
      title: 'Title',
      dataIndex: `title`,
      key: 'title',
    },
    {
      title: 'Pages',
      dataIndex: 'pages',
      key: 'pages',
      render: (pages: string[]) => pages?.length || 0,
    },
    {
      title: 'Last Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: ChapterResponse) => (
        <Space size="small">
          <Button
            icon={<EyeOutlined />}
            onClick={() => showPreviewModal(record.chapterIndex)}
            title="Preview Chapter"
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            title="Edit Chapter"
          />
          <Popconfirm
            title="Are you sure you want to delete this chapter?"
            onConfirm={() => handleDeleteChapter(record.chapterIndex)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} title="Delete Chapter" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="manga-chapter-list-container">
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item>
            <Link to="/dashboard">
              <HomeOutlined /> Dashboard
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/dashboard/manga">
              <BookOutlined /> Manga
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{manga?.title || 'Loading...'}</Breadcrumb.Item>
          <Breadcrumb.Item>Chapters</Breadcrumb.Item>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-4">
          <Title level={3} className="m-0">
            {loading ? 'Loading...' : `Chapters for: ${manga?.title}`}
          </Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
            Add Chapter
          </Button>
        </div>

        <Card loading={loading}>
          <Table
            columns={columns}
            dataSource={chapters}
            rowKey="chapterIndex"
            pagination={false}
          />
        </Card>

        {/* Add/Edit Chapter Modal */}
        <Modal
          title={modalType === 'add' ? 'Add New Chapter' : 'Edit Chapter'}
          open={modalVisible}
          onOk={handleModalOk}
          onCancel={() => setModalVisible(false)}
          confirmLoading={loading}
          width={700}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="chapterIndex"
              label="Chapter Number"
              rules={[
                { required: true, message: 'Please enter chapter number' },
              ]}
            >
              <Input type="number" placeholder="Enter chapter number" />
            </Form.Item>

            <Form.Item
              name="title"
              label="Chapter Title"
              rules={[
                { required: true, message: 'Please enter chapter title' },
              ]}
            >
              <Input placeholder="Enter chapter title" />
            </Form.Item>

            <Form.Item
              name="pages"
              label="Chapter Pages"
              rules={[
                {
                  required: modalType === 'add',
                  message: 'Please upload at least one page',
                },
              ]}
            >
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag image files to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for single or bulk upload. Images will be displayed in
                  the order they are uploaded.
                </p>
              </Dragger>
            </Form.Item>
          </Form>
        </Modal>

        {/* Chapter Preview Modal */}
        <Modal
          title="Chapter Preview"
          open={previewModalVisible}
          onCancel={() => setPreviewModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setPreviewModalVisible(false)}>
              Close
            </Button>,
          ]}
          width={800}
        >
          <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
            <List
              grid={{ gutter: 16, column: 1 }}
              dataSource={previewPages}
              renderItem={(page, index) => (
                <List.Item>
                  <div className="text-center mb-2">
                    <Text strong>Page {index + 1}</Text>
                  </div>
                  <Image
                    src={page}
                    alt={`Page ${index + 1}`}
                    style={{ width: '100%', maxHeight: '100vh' }}
                  />
                </List.Item>
              )}
            />
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default MangaChapterList;
