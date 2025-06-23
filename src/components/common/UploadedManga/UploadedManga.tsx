import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Empty,
  Spin,
  Button,
  Row,
  Col,
  Tag,
  Pagination,
  message,
  Layout,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Space,
  Alert,
} from 'antd';
import {
  BookOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  InboxOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import * as mangaService from '../../../libs/mangaServices';
import * as userService from '../../../libs/userService';
import * as chapterService from '../../../libs/chapterServices';
import { RcFile, UploadFile } from 'antd/es/upload';
import { MangaItem, MangaStatus } from '../../../libs/mangaServices';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import './uploadedManga.css';

// Initialize dayjs plugins
dayjs.extend(relativeTime);

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const UploadedManga: React.FC = () => {
  const navigate = useNavigate();
  const [mangaList, setMangaList] = useState<MangaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  // Edit manga modal states
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [editingManga, setEditingManga] = useState<MangaItem | null>(null);
  const [editForm] = Form.useForm();
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string>('');
  const [backgroundPreview, setBackgroundPreview] = useState<string>('');
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  // Chapter upload modal states
  const [isChapterModalVisible, setIsChapterModalVisible] =
    useState<boolean>(false);
  const [selectedMangaForChapter, setSelectedMangaForChapter] =
    useState<MangaItem | null>(null);
  const [chapterForm] = Form.useForm();
  const [chapterFiles, setChapterFiles] = useState<File[]>([]);
  const [chapterFilePreviews, setChapterFilePreviews] = useState<string[]>([]);
  const [uploadingChapter, setUploadingChapter] = useState<boolean>(false);

  useEffect(() => {
    fetchUploadedManga(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const fetchUploadedManga = async (page: number, size: number) => {
    try {
      setLoading(true);
      setError(null);

      const currentUser = userService.getCurrentUser();

      if (!currentUser || !currentUser.userID) {
        setError('Please log in to view your uploads');
        setLoading(false);
        return;
      }

      const offset = (page - 1) * size;
      const response = await mangaService.searchManga(
        { uploadedBy: currentUser.userID },
        offset,
        size,
      );

      if (response) {
        // Handle different response formats
        if (Array.isArray(response)) {
          setMangaList(response);
          setTotal(response.length);
        } else if (response.content && Array.isArray(response.content)) {
          setMangaList(response.content);
          setTotal(response.totalElements || response.content.length);
        } else {
          setMangaList([]);
          setTotal(0);
        }
      } else {
        setMangaList([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Error fetching uploaded manga:', error);
      setError('Failed to load your uploaded manga');
      message.error('Failed to load your uploads');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (mangaId: number) => {
    try {
      if (window.confirm('Are you sure you want to delete this manga?')) {
        await mangaService.deleteManga(mangaId);
        message.success('Manga deleted successfully');
        // Refresh the list
        fetchUploadedManga(currentPage, pageSize);
      }
    } catch (error) {
      console.error('Error deleting manga:', error);
      message.error('Failed to delete manga');
    }
  };

  // Function to handle opening edit modal
  const handleEdit = async (mangaId: number) => {
    try {
      const manga = await mangaService.getMangaById(mangaId);
      setEditingManga(manga);

      // Set form values
      editForm.setFieldsValue({
        title: manga.title,
        author: manga.author,
        description: manga.description,
        overview: manga.overview,
        genres: manga.genres,
      });

      // Set image previews
      if (manga.posterUrl) {
        setPosterPreview(manga.posterUrl);
      }
      if (manga.backgroundUrl) {
        setBackgroundPreview(manga.backgroundUrl);
      }

      // Show modal
      setIsEditModalVisible(true);
    } catch (error) {
      console.error('Error fetching manga details:', error);
      message.error('Failed to load manga details for editing');
    }
  };

  // Function to handle image uploads
  const handleImageUpload = (
    info: { file: { originFileObj?: File } },
    type: 'poster' | 'background',
  ) => {
    if (info.file) {
      // Get the file
      const file = info.file.originFileObj;

      if (file) {
        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
          if (type === 'poster') {
            setPosterFile(file);
            setPosterPreview(reader.result as string);
          } else {
            setBackgroundFile(file);
            setBackgroundPreview(reader.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      await editForm.validateFields();
      setSubmitLoading(true);

      const values = editForm.getFieldsValue();

      if (!editingManga) {
        message.error('No manga selected for editing');
        return;
      }

      const currentUser = userService.getCurrentUser();
      console.log('Current user:', currentUser);
      if (!currentUser || !currentUser.userID) {
        message.error('User information not available');
        return;
      }

      const payload: mangaService.MangaRequestDTO = {
        title: values.title,
        author: values.author,
        description: values.description,
        overview: values.overview,
        genres: values.genres,
        poster: posterFile || new File([], ''), // Pass empty file if not updated
        background: backgroundFile || new File([], ''), // Pass empty file if not updated
        userId: currentUser.userID,
      };

      await mangaService.updateManga(editingManga.id, payload);

      message.success('Manga updated successfully');
      setIsEditModalVisible(false);
      fetchUploadedManga(currentPage, pageSize);
    } catch (error) {
      console.error('Error updating manga:', error);
      message.error('Failed to update manga');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Function to handle modal cancel
  const handleCancel = () => {
    setIsEditModalVisible(false);
    setEditingManga(null);
    setPosterFile(null);
    setBackgroundFile(null);
    setPosterPreview('');
    setBackgroundPreview('');
    editForm.resetFields();
  };

  // Function to open chapter upload modal
  const handleOpenChapterModal = (manga: MangaItem) => {
    setSelectedMangaForChapter(manga);
    chapterForm.resetFields();
    setChapterFiles([]);
    setChapterFilePreviews([]);
    setIsChapterModalVisible(true);
  };

  // Function to handle chapter modal cancel
  const handleChapterModalCancel = () => {
    setIsChapterModalVisible(false);
    setSelectedMangaForChapter(null);
    setChapterFiles([]);
    setChapterFilePreviews([]);
    chapterForm.resetFields();
  };

  // Function to handle chapter image uploads
  const handleChapterImageUpload = (info: { fileList: any[] }) => {
    const fileList = info.fileList;

    // Process file list
    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    // Process each file
    fileList.forEach((file: any) => {
      // Only add if it's a valid file
      if (file.originFileObj && file.originFileObj instanceof File) {
        newFiles.push(file.originFileObj);

        // Create preview URL
        if (!file.preview) {
          const reader = new FileReader();
          reader.onload = () => {
            const preview = reader.result as string;
            file.preview = preview;
            // Update previews array
            setChapterFilePreviews(prev => {
              const updated = [...prev];
              const index = fileList.findIndex(f => f.uid === file.uid);
              if (index !== -1) {
                updated[index] = preview;
              }
              return updated;
            });
          };
          reader.readAsDataURL(file.originFileObj);
        } else {
          newPreviews.push(file.preview);
        }
      }
    });

    setChapterFiles(newFiles);
  };

  // Submit chapter upload
  const handleChapterSubmit = async () => {
    try {
      await chapterForm.validateFields();

      if (!selectedMangaForChapter) {
        message.error('No manga selected');
        return;
      }

      if (chapterFiles.length === 0) {
        message.error('Please upload at least one image for the chapter');
        return;
      }

      setUploadingChapter(true);

      const values = chapterForm.getFieldsValue();
      const chapterIndex = values.chapterIndex;
      const chapterTitle = values.title;

      // Create form data
      const formData = new FormData();
      formData.append('chapter_index', chapterIndex);
      formData.append('title', chapterTitle);

      // Add all chapter pages
      chapterFiles.forEach((file, index) => {
        formData.append(`pages`, file);
      });

      // Upload the chapter
      await chapterService.addChapter(
        selectedMangaForChapter.id,
        chapterIndex,
        formData,
      );

      message.success('Chapter uploaded successfully');

      // Close modal and reset state
      setIsChapterModalVisible(false);
      setSelectedMangaForChapter(null);
      setChapterFiles([]);
      setChapterFilePreviews([]);
      chapterForm.resetFields();

      // Refresh manga list to show updated chapter count
      fetchUploadedManga(currentPage, pageSize);
    } catch (error) {
      console.error('Error uploading chapter:', error);
      message.error('Failed to upload chapter');
    } finally {
      setUploadingChapter(false);
    }
  };

  // Helper function to get genre color
  const getGenreColor = (genre: string) => {
    const colors: Record<string, string> = {
      ACTION: 'blue',
      ADVENTURE: 'green',
      COMEDY: 'magenta',
      DRAMA: 'volcano',
      FANTASY: 'purple',
      HORROR: 'red',
      ROMANCE: 'pink',
      SCI_FI: 'geekblue',
      SLICE_OF_LIFE: 'cyan',
      SUPERNATURAL: 'orange',
    };
    return colors[genre] || 'default';
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      [MangaStatus.PENDING]: 'orange',
      [MangaStatus.APPROVED]: 'green',
      [MangaStatus.REJECTED]: 'red',
      [MangaStatus.HIDDEN]: 'gray',
      [MangaStatus.DELETED]: 'black',
      [MangaStatus.UPDATE]: 'blue',
    };
    return colors[status] || 'default';
  };

  const renderEmptyState = () => (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <span className="text-gray-500">
            You haven't uploaded any manga yet.
          </span>
        }
      >
        <Button
          type="primary"
          onClick={() => navigate('/upload')}
          className="mt-4"
        >
          Upload Manga
        </Button>
      </Empty>
    </div>
  );

  if (loading && currentPage === 1) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 mb-4">{error}</div>
        <Button type="primary" onClick={() => navigate('/auth/login')}>
          Log In
        </Button>
      </div>
    );
  }

  return (
    <Layout className="bg-gray-100 min-h-screen">
      <Content>
        <div style={{ height: '100px' }}></div>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Title level={2} className="m-0">
                My Uploaded Manga
              </Title>
            </div>
            <Button type="primary" onClick={() => navigate('/upload')}>
              Upload New Manga
            </Button>
          </div>

          {mangaList.length === 0 && !loading ? (
            renderEmptyState()
          ) : (
            <>
              <Row gutter={[16, 16]}>
                {mangaList.map(manga => (
                  <Col xs={24} key={manga.id}>
                    <Card className="w-full hover:shadow-md transition-shadow duration-300 manga-card">
                      <div className="flex">
                        {/* Manga poster */}
                        <Link
                          to={`/manga/${manga.id}`}
                          onClick={() => mangaService.handleViewManga(manga.id)}
                          className="flex-shrink-0"
                        >
                          <img
                            src={
                              manga.posterUrl ||
                              'https://placehold.co/150x200/e2e8f0/1e293b?text=No+Image'
                            }
                            alt={manga.title}
                            className="w-28 h-40 object-cover rounded-lg shadow-sm"
                            onError={e => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                'https://placehold.co/150x200/e2e8f0/1e293b?text=Error';
                            }}
                          />
                        </Link>

                        {/* Manga details */}
                        <div className="ml-4 flex-grow flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between">
                              <Link
                                to={`/manga/${manga.id}`}
                                onClick={() =>
                                  mangaService.handleViewManga(manga.id)
                                }
                              >
                                <Title
                                  level={4}
                                  className="mb-1 hover:text-blue-600 transition-colors"
                                >
                                  {manga.title}
                                </Title>
                              </Link>
                              <Tag
                                color={getStatusColor(manga.status.toString())}
                              >
                                {manga.status}
                              </Tag>
                            </div>

                            <div className="text-gray-500 mb-2">
                              by {manga.author || 'Unknown Author'}
                            </div>

                            {/* Genres */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {manga.genres &&
                                manga.genres.slice(0, 3).map((genre, idx) => (
                                  <Tag
                                    key={idx}
                                    color={getGenreColor(genre)}
                                    className="mr-0"
                                  >
                                    {genre.replace('_', ' ')}
                                  </Tag>
                                ))}
                              {manga.genres && manga.genres.length > 3 && (
                                <Tag className="mr-0">
                                  +{manga.genres.length - 3}
                                </Tag>
                              )}
                            </div>

                            <Paragraph
                              className="text-gray-600 text-sm mb-3"
                              ellipsis={{ rows: 2, expandable: false }}
                            >
                              {manga.overview}
                            </Paragraph>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <EyeOutlined className="mr-1" />
                                {manga.readTimes || 0} reads
                              </span>
                              <span className="flex items-center">
                                <ClockCircleOutlined className="mr-1" />
                                Updated: {dayjs(manga.updatedAt).fromNow()}
                              </span>
                              <span className="flex items-center">
                                <BookOutlined className="mr-1" />
                                {manga.chapters?.length || 0} chapters
                              </span>
                            </div>

                            <div className="space-x-2">
                              <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => handleEdit(manga.id)}
                              >
                                Edit
                              </Button>
                              <Button
                                type="primary"
                                ghost
                                icon={<UploadOutlined />}
                                onClick={() => handleOpenChapterModal(manga)}
                                disabled={manga.status !== 'APPROVED'}
                                title={
                                  manga.status !== 'APPROVED'
                                    ? 'Manga must be approved to add chapters'
                                    : 'Add New Chapter'
                                }
                              >
                                Upload Chapter
                              </Button>
                              <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(manga.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              <div className="flex justify-center mt-8">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={total}
                  onChange={page => setCurrentPage(page)}
                  onShowSizeChange={(_, size) => {
                    setCurrentPage(1);
                    setPageSize(size);
                  }}
                  showSizeChanger
                  showQuickJumper
                  showTotal={total => `Total ${total} manga`}
                  disabled={loading}
                />
              </div>
            </>
          )}
        </div>
      </Content>

      {/* Edit Manga Modal */}
      <Modal
        title="Edit Manga"
        open={isEditModalVisible}
        onCancel={handleCancel}
        width={800}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={submitLoading}
            onClick={handleSubmit}
          >
            Update Manga
          </Button>,
        ]}
      >
        <Form
          form={editForm}
          layout="vertical"
          requiredMark="optional"
          initialValues={{ genres: [] }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="title"
                label="Manga Title"
                rules={[
                  { required: true, message: 'Please enter manga title' },
                ]}
              >
                <Input placeholder="Enter manga title" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="author"
                label="Author"
                rules={[
                  { required: true, message: 'Please enter author name' },
                ]}
              >
                <Input placeholder="Enter author name" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="overview"
            label="Overview (Short description)"
            rules={[{ required: true, message: 'Please enter an overview' }]}
          >
            <Input.TextArea
              placeholder="Brief description of the manga"
              autoSize={{ minRows: 2, maxRows: 3 }}
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Full Description"
            rules={[
              { required: true, message: 'Please enter a full description' },
            ]}
          >
            <Input.TextArea
              placeholder="Detailed description of the manga"
              autoSize={{ minRows: 4, maxRows: 8 }}
              showCount
              maxLength={2000}
            />
          </Form.Item>

          <Form.Item
            name="genres"
            label="Genres"
            rules={[
              {
                required: true,
                type: 'array',
                min: 1,
                message: 'Please select at least one genre',
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select genres"
              optionFilterProp="children"
              style={{ width: '100%' }}
            >
              <Select.Option value="ACTION">Action</Select.Option>
              <Select.Option value="ADVENTURE">Adventure</Select.Option>
              <Select.Option value="COMEDY">Comedy</Select.Option>
              <Select.Option value="DRAMA">Drama</Select.Option>
              <Select.Option value="FANTASY">Fantasy</Select.Option>
              <Select.Option value="HORROR">Horror</Select.Option>
              <Select.Option value="ROMANCE">Romance</Select.Option>
              <Select.Option value="SCI_FI">Sci-Fi</Select.Option>
              <Select.Option value="SLICE_OF_LIFE">Slice of Life</Select.Option>
              <Select.Option value="SUPERNATURAL">Supernatural</Select.Option>
              <Select.Option value="MYSTERY">Mystery</Select.Option>
              <Select.Option value="PSYCHOLOGICAL">Psychological</Select.Option>
              <Select.Option value="THRILLER">Thriller</Select.Option>
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Poster Image"
                tooltip="Main cover image for the manga"
              >
                <Upload
                  name="poster"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={info => handleImageUpload(info, 'poster')}
                >
                  {posterPreview ? (
                    <img
                      src={posterPreview}
                      alt="Poster"
                      style={{ width: '100%' }}
                    />
                  ) : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
                <div className="text-xs text-gray-500 mt-2">
                  Recommended size: 350x500px
                </div>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Background Image"
                tooltip="Banner image for manga details page"
              >
                <Upload
                  name="background"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={info => handleImageUpload(info, 'background')}
                >
                  {backgroundPreview ? (
                    <img
                      src={backgroundPreview}
                      alt="Background"
                      style={{ width: '100%' }}
                    />
                  ) : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
                <div className="text-xs text-gray-500 mt-2">
                  Recommended size: 1200x400px
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Chapter Upload Modal */}
      <Modal
        title={`Upload New Chapter${
          selectedMangaForChapter ? ` for ${selectedMangaForChapter.title}` : ''
        }`}
        open={isChapterModalVisible}
        onCancel={handleChapterModalCancel}
        width={700}
        footer={[
          <Button key="cancel" onClick={handleChapterModalCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleChapterSubmit}
            loading={uploadingChapter}
            disabled={chapterFiles.length === 0}
          >
            Upload Chapter
          </Button>,
        ]}
      >
        <Form
          form={chapterForm}
          layout="vertical"
          initialValues={{ chapterIndex: '', title: '' }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Alert
                type="info"
                message="Chapter uploads require at least one image. Images will be displayed in the order you upload them."
                className="mb-4"
              />
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Chapter Number"
                name="chapterIndex"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the chapter number',
                  },
                ]}
              >
                <Input type="number" placeholder="e.g. 1" min={1} step={1} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Chapter Title"
                name="title"
                rules={[
                  {
                    required: true,
                    message: 'Please enter a title for this chapter',
                  },
                ]}
              >
                <Input placeholder="e.g. The Beginning" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Chapter Pages"
                required
                tooltip="Upload all pages for this chapter. Images will be displayed in the order they are uploaded."
              >
                <Upload.Dragger
                  name="pages"
                  listType="picture-card"
                  fileList={chapterFiles.map((file, index) => ({
                    uid: `-${index}`,
                    name: file.name,
                    status: 'done',
                    url: chapterFilePreviews[index],
                    originFileObj: file,
                  }))}
                  beforeUpload={() => false}
                  onChange={handleChapterImageUpload}
                  multiple={true}
                  accept="image/*"
                  className="chapter-uploader"
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag files to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Support for single or bulk upload. Images will be shown in
                    the order they are uploaded.
                  </p>
                </Upload.Dragger>
                {chapterFilePreviews.length > 0 && (
                  <div className="mt-4 chapter-preview-grid">
                    {chapterFilePreviews.map((preview, index) => (
                      <div key={index} className="chapter-preview-item">
                        <img
                          src={preview}
                          alt={`Page ${index + 1}`}
                          className="chapter-preview-image"
                        />
                        <div className="chapter-preview-number">
                          Page {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Layout>
  );
};

export default UploadedManga;
