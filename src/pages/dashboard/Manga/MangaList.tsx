/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Modal,
  Form,
  Upload,
  message,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FileOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../libs/api';
import DashboardLayout from '../DashboardLayout';
import {
  getAllManga,
  createManga,
  updateManga,
  deleteManga,
  searchManga,
  SearchMangaDTO,
  MangaStatus,
  updateMangaStatus,
} from '../../../libs/mangaServices';
import * as userSerices from '../../../libs/userService';
const { Option } = Select;

export const MangaGenre: Record<string, string> = {
  SHONEN: 'SHONEN',
  SHOJO: 'SHOJO',
  SEINEN: 'SEINEN',
  JOSEI: 'JOSEI',
  ISEKAI: 'ISEKAI',
  MECHA: 'MECHA',
  SLICE_OF_LIFE: 'SLICE_OF_LIFE',
  FANTASY: 'FANTASY',
  SCI_FI: 'SCI_FI',
  HORROR: 'HORROR',
  MYSTERY: 'MYSTERY',
  SUPERNATURAL: 'SUPERNATURAL',
  ROMANCE: 'ROMANCE',
  COMEDY: 'COMEDY',
  SPORTS: 'SPORTS',
  HISTORICAL: 'HISTORICAL',
  MARTIAL_ARTS: 'MARTIAL_ARTS',
  PSYCHOLOGICAL: 'PSYCHOLOGICAL',
  MUSIC: 'MUSIC',
  ADVENTURE: 'ADVENTURE',
  HAREM: 'HAREM',
  REVERSE_HAREM: 'REVERSE_HAREM',
  GAME: 'GAME',
  DEMONS: 'DEMONS',
  VAMPIRE: 'VAMPIRE',
};

const MangaList = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  interface Manga {
    id: number;
    title: string;
    description: string;
    overview: string;
    author: string;
    status: string;
    adminStatus?: string;
    posterUrl: string;
    backgroundUrl: string;
    chapterCount: number;
    genres: string[];
  }

  const [data, setData] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editingMangaId, setEditingMangaId] = useState<number | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const userInfo = userSerices.getCurrentUser();

  // Fetch total manga count
  const fetchTotalMangaCount = async () => {
    try {
      const response = await getAllManga(0, 1000, 'createdAt', true);
      if (response && typeof response === 'object') {
        if (response.data && Array.isArray(response.data)) {
          return response.data.length;
        } else if (Array.isArray(response)) {
          return response.length;
        }
      }
      return 0;
    } catch (error) {
      console.error('Error fetching total manga count:', error);
      return 0;
    }
  };

  // Fetch manga list
  const fetchManga = async (page = 1, limit = 10) => {
    try {
      setLoading(true); // Get total count first
      const totalCount = await fetchTotalMangaCount();

      // Calculate correct offset based on page number
      const offset = page - 1;
      console.log(
        `Fetching page ${page} with offset ${offset} and limit ${limit}`,
      );

      const response = await getAllManga(offset, limit, 'createdAt', true);
      console.log('Fetched Manga: ', response);

      if (response && typeof response === 'object') {
        if (response.data && Array.isArray(response.data)) {
          setData(response.data);
          setPagination({
            ...pagination,
            current: page,
            pageSize: limit,
            total: totalCount,
          });
        } else if (Array.isArray(response)) {
          setData(response);
          setPagination({
            ...pagination,
            current: page,
            pageSize: limit,
            total: totalCount,
          });
          console.log('Setting total from total count to:', totalCount);
        }
      } else {
        // Fallback for unexpected response format
        const responseData = Array.isArray(response) ? response : [];
        setData(responseData);
        setPagination({
          ...pagination,
          current: page,
          pageSize: limit,
          total: totalCount,
        });
        console.log('Setting total from fallback to:', totalCount);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching manga:', error);
      message.error('Failed to fetch manga list');
      setLoading(false);
    }
  };

  // Search manga by title
  const searchMangaByTitle = async (page = 1, limit = 10, title = '') => {
    try {
      setLoading(true);

      const searchQuery: SearchMangaDTO = {
        title: title,
      };

      // Get a count of all matching manga for accurate pagination
      const countResponse = await searchManga(
        searchQuery,
        0,
        1000, // Large limit to get all results
      );

      // Calculate total based on the full result set
      let totalCount = 0;
      if (
        countResponse &&
        countResponse.data &&
        Array.isArray(countResponse.data)
      ) {
        totalCount = countResponse.data.length;
      } else if (Array.isArray(countResponse)) {
        totalCount = countResponse.length;
      }

      // Now fetch the paginated results
      const response = await searchManga(searchQuery, page - 1, limit);

      console.log('Search Results:', response);

      if (response && response.data && Array.isArray(response.data)) {
        setData(response.data);
        setPagination({
          ...pagination,
          current: page,
          pageSize: limit,
          total: totalCount,
        });
        console.log('Search results total:', totalCount);
      } else {
        // Fallback if response structure is different
        const responseData = Array.isArray(response) ? response : [];
        setData(responseData);
        setPagination({
          ...pagination,
          current: page,
          pageSize: limit,
          total: totalCount,
        });
        console.log('Search results total:', totalCount);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error searching manga:', error);
      message.error('Failed to search manga');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManga(pagination.current, pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = (newPagination: any) => {
    console.log('Pagination change:', newPagination);

    // Ensure we're getting a valid page number and size
    const pageNumber = newPagination.current || 1;
    const pageSize = newPagination.pageSize || 10;

    console.log(`Table change: Page ${pageNumber}, Size ${pageSize}`);

    // Make sure we're using the provided pagination values consistently
    if (searchText.trim()) {
      searchMangaByTitle(pageNumber, pageSize, searchText);
    } else {
      fetchManga(pageNumber, pageSize);
    }
  };

  const handleSearch = () => {
    if (searchText.trim()) {
      // Use search service when search text is provided
      searchMangaByTitle(1, pagination.pageSize, searchText);
    } else {
      // If search text is empty, use regular fetch
      fetchManga(1, pagination.pageSize);
    }
  };

  const showAddModal = () => {
    form.resetFields();
    setPosterFile(null);
    setBackgroundFile(null);
    setModalType('add');
    setModalVisible(true);
  };

  const showEditModal = (record: Manga) => {
    setEditingMangaId(record.id);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      overview: record.overview,
      author: record.author,
      status: record.status,
      genres: record.genres,
    });
    setModalType('edit');
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (modalType === 'add' && (!posterFile || !backgroundFile)) {
        message.error('Please upload both poster and background images');
        return;
      }

      setLoading(true);
      console.log('Checking user info:', userInfo);
      if (modalType === 'add') {
        await createManga({
          title: values.title,
          author: values.author,
          description: values.description,
          overview: values.overview,
          genres: values.genres,
          poster: posterFile as File,
          background: backgroundFile as File,
          userId: userInfo.userID, // Replace with actual user ID as needed
        });
        message.success('Manga added successfully');
      } else {
        await updateManga(editingMangaId as number, {
          title: values.title,
          author: values.author,
          description: values.description,
          overview: values.overview,
          genres: values.genres,
          poster: posterFile as File,
          background: backgroundFile as File,
          userId: userInfo.userID, // Replace with actual user ID as needed
        });
        message.success('Manga updated successfully');
      }

      setModalVisible(false);
      // Refetch the data
      fetchManga(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      console.error('Error saving manga:', error);
      message.error('Failed to save manga');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await deleteManga(id);
      message.success('Manga deleted successfully');
      // Refetch the data
      fetchManga(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      console.error('Error deleting manga:', error);
      message.error('Failed to delete manga');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      setLoading(true);
      await updateMangaStatus(id, status);
      message.success(`Manga status updated to ${status}`);
      // Refetch the data to update the UI
      fetchManga(pagination.current, pagination.pageSize, searchText);
    } catch (error) {
      console.error('Error updating manga status:', error);
      message.error('Failed to update manga status');
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const posterProps = {
    beforeUpload: (file: File) => {
      setPosterFile(file);
      return false;
    },
    fileList: posterFile
      ? [
          {
            uid: '-1',
            name: posterFile.name,
            status: 'done',
            url:
              posterFile instanceof File
                ? URL.createObjectURL(posterFile)
                : undefined,
            originFileObj: posterFile as any,
          },
        ]
      : [],
  };

  const backgroundProps = {
    beforeUpload: (file: File) => {
      setBackgroundFile(file);
      return false;
    },
    fileList: backgroundFile
      ? [
          {
            uid: '-1',
            name: backgroundFile.name,
            status: 'done',
            url:
              backgroundFile instanceof File
                ? URL.createObjectURL(backgroundFile)
                : undefined,
            originFileObj: backgroundFile as any,
          },
        ]
      : [],
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Genres',
      dataIndex: 'genres',
      key: 'genres',
      render: (genres: string[]) => (
        <>
          {genres &&
            genres.map(genre => (
              <Tag color="blue" key={genre}>
                {genre}
              </Tag>
            ))}
        </>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'blue'}>
          {status === 'active' ? 'Active' : 'Completed'}
        </Tag>
      ),
    },
    {
      title: 'Admin Status',
      dataIndex: 'status',
      key: 'adminStatus',
      render: (_: any, record: Manga) => (
        <Select
          defaultValue={record.status || 'PENDING'}
          style={{ width: 120 }}
          onChange={value => handleStatusChange(record.id, value)}
          disabled={loading}
        >
          {Object.values(MangaStatus).map(status => (
            <Option key={status} value={status}>
              {status}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Chapters',
      dataIndex: 'chapterCount',
      key: 'chapterCount',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Manga) => (
        <Space size="small">
          <Button
            icon={<FileOutlined />}
            onClick={() => navigate(`/dashboard/manga/${record.id}/chapters`)}
            title="Manage Chapters"
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            title="Edit Manga"
          />
          <Popconfirm
            title="Are you sure you want to delete this manga?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} title="Delete Manga" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="manga-list-container">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Manga Management</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
            Add Manga
          </Button>
        </div>

        <div className="mb-4 flex">
          <Input
            placeholder="Search by title"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            prefix={<SearchOutlined />}
            className="mr-2"
          />
          <Button type="primary" onClick={handleSearch}>
            Search
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50'],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            size: 'small',
            simple: true,
            showQuickJumper: true,
            itemRender: (page, type, originalElement) => {
              if (type === 'page') {
                return <Button size="small">{page}</Button>;
              }
              return originalElement;
            },
          }}
          loading={loading}
          onChange={handleTableChange}
        />

        <Modal
          title={modalType === 'add' ? 'Add New Manga' : 'Edit Manga'}
          open={modalVisible}
          onOk={handleModalOk}
          onCancel={() => setModalVisible(false)}
          confirmLoading={loading}
          width={700}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please enter manga title' }]}
            >
              <Input placeholder="Enter manga title" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: 'Please enter manga description' },
              ]}
            >
              <Input.TextArea rows={4} placeholder="Enter manga description" />
            </Form.Item>

            <Form.Item
              name="overview"
              label="Overview"
              rules={[
                { required: true, message: 'Please enter manga overview' },
              ]}
            >
              <Input.TextArea rows={2} placeholder="Enter manga overview" />
            </Form.Item>

            <Form.Item
              name="author"
              label="Author"
              rules={[{ required: true, message: 'Please enter author name' }]}
            >
              <Input placeholder="Enter author name" />
            </Form.Item>

            <Form.Item
              name="genres"
              label="Genres"
              rules={[
                { required: true, message: 'Please select at least one genre' },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Select genres"
                style={{ width: '100%' }}
                allowClear
              >
                {Object.values(MangaGenre).map(genre => (
                  <Option key={genre} value={genre}>
                    {genre.replace('_', ' ')}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select status' }]}
            >
              <Select placeholder="Select status">
                <Option value="active">Active</Option>
                <Option value="completed">Completed</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="poster"
              label="Poster Image"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload {...posterProps} listType="picture" maxCount={1}>
                <Button icon={<UploadOutlined />}>Upload Poster</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              name="background"
              label="Background Image"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload {...backgroundProps} listType="picture" maxCount={1}>
                <Button icon={<UploadOutlined />}>Upload Background</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default MangaList;
