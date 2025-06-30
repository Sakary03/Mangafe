import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Select, message, Spin } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { MangaGenres } from '../../../types/MangaGenres';
import type { RcFile } from 'antd/es/upload/interface';
import * as userService from '../../../libs/userService';
import * as mangaService from '../../../libs/mangaServices';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Option } = Select;

const GENRE_OPTIONS = Object.values(MangaGenres);

const UploadManga: React.FC = () => {
  const [form] = Form.useForm();
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    return () => {
      if (posterPreview) {
        URL.revokeObjectURL(posterPreview);
      }
      if (backgroundPreview) {
        URL.revokeObjectURL(backgroundPreview);
      }
    };
  }, [posterPreview, backgroundPreview]);

  const handlePosterChange = (info: any) => {
    console.log('Poster change triggered:', info);

    if (info.file.status === 'removed') {
      console.log('Removing poster file');
      setPosterFile(null);
      if (posterPreview) {
        URL.revokeObjectURL(posterPreview);
        setPosterPreview(null);
      }
      return;
    }

    const file = info.file.originFileObj || info.file;

    if (!file) {
      console.log('No valid file object found');
      return;
    }

    console.log('Setting poster file:', file);
    setPosterFile(file);

    // Create preview
    try {
      const previewURL = URL.createObjectURL(file);
      console.log('Created preview URL:', previewURL);
      setPosterPreview(previewURL);
    } catch (error) {
      console.error('Error creating preview URL:', error);
    }
  };

  const handleBackgroundChange = (info: any) => {
    console.log('Background change triggered:', info);

    // Check if it's a removal action
    if (info.file.status === 'removed') {
      console.log('Removing background file');
      setBackgroundFile(null);
      if (backgroundPreview) {
        URL.revokeObjectURL(backgroundPreview);
        setBackgroundPreview(null);
      }
      return;
    }

    // Get file object (handle both originFileObj and raw File objects)
    const file = info.file.originFileObj || info.file;

    if (!file) {
      console.log('No valid file object found');
      return;
    }

    console.log('Setting background file:', file);
    setBackgroundFile(file);

    // Create preview
    try {
      const previewURL = URL.createObjectURL(file);
      console.log('Created preview URL:', previewURL);
      setBackgroundPreview(previewURL);
    } catch (error) {
      console.error('Error creating preview URL:', error);
    }
  };

  const onFinish = async (values: any) => {
    const user = await userService.getCurrentUser();
    console.log('User ID:', user);
    if (!user.userID) {
      message.error('You must be logged in to upload manga.');
      return;
    }

    if (!posterFile || !backgroundFile) {
      message.error('Please upload both poster and background images.');
      return;
    }

    setLoading(true);

    try {
      const mangaPayload: mangaService.MangaRequestDTO = {
        title: values.title,
        author: values.author,
        description: values.description,
        overview: values.overview,
        genres: values.genres,
        poster: posterFile,
        background: backgroundFile,
        userId: user.userID,
      };

      await mangaService.createManga(mangaPayload);

      message.success('Manga uploaded successfully!');
      form.resetFields();
      setPosterFile(null);
      setBackgroundFile(null);

      if (posterPreview) {
        URL.revokeObjectURL(posterPreview);
        setPosterPreview(null);
      }

      if (backgroundPreview) {
        URL.revokeObjectURL(backgroundPreview);
        setBackgroundPreview(null);
      }
      navigate(`/user/uploaded`);
    } catch (error: any) {
      message.error('Upload failed. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 pt-20">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
        <h2
          className="text-3xl font-bold mb-8 text-center"
          style={{ color: '#2563EB' }}
        >
          Upload Manga
        </h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="space-y-4"
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: 'Please enter the manga title' },
            ]}
          >
            <Input className="rounded-md" />
          </Form.Item>
          <Form.Item
            label="Author"
            name="author"
            rules={[{ required: true, message: 'Please enter the author' }]}
          >
            <Input className="rounded-md" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: 'Please enter the description' },
            ]}
          >
            <TextArea rows={3} className="rounded-md" />
          </Form.Item>
          <Form.Item
            label="Overview"
            name="overview"
            rules={[{ required: true, message: 'Please enter the overview' }]}
          >
            <TextArea rows={2} className="rounded-md" />
          </Form.Item>
          <Form.Item
            label="Genres"
            name="genres"
            rules={[
              { required: true, message: 'Please select at least one genre' },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select genres"
              className="rounded-md"
              style={{ borderColor: '#2563EB' }}
            >
              {GENRE_OPTIONS.map(genre => (
                <Option key={genre} value={genre}>
                  {genre}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Poster" required>
            <div className="flex flex-col items-center">
              <Upload
                beforeUpload={file => {
                  // Handle file directly here as a backup
                  setPosterFile(file);
                  try {
                    const previewURL = URL.createObjectURL(file);
                    setPosterPreview(previewURL);
                  } catch (error) {
                    console.error('Error creating preview URL:', error);
                  }
                  // Return false to prevent auto-upload
                  return false;
                }}
                onChange={handlePosterChange}
                maxCount={1}
                accept="image/*"
                showUploadList={false}
              >
                {!posterPreview ? (
                  <Button
                    icon={<UploadOutlined />}
                    style={{ background: '#2563EB', color: '#fff' }}
                  >
                    Select Poster
                  </Button>
                ) : (
                  <Button>Change Poster</Button>
                )}
              </Upload>

              {posterPreview && (
                <div className="mt-4 relative">
                  <img
                    src={posterPreview}
                    alt="Poster Preview"
                    className="w-32 h-48 object-cover rounded-md border border-gray-300"
                  />
                  <Button
                    type="text"
                    danger
                    className="absolute top-0 right-0 bg-white/70 rounded-full p-1 text-xs"
                    onClick={() => {
                      setPosterFile(null);
                      URL.revokeObjectURL(posterPreview);
                      setPosterPreview(null);
                    }}
                  >
                    ✕
                  </Button>
                </div>
              )}
            </div>
          </Form.Item>
          <Form.Item label="Background" required>
            <div className="flex flex-col items-center">
              <Upload
                beforeUpload={file => {
                  // Handle file directly here as a backup
                  setBackgroundFile(file);
                  try {
                    const previewURL = URL.createObjectURL(file);
                    setBackgroundPreview(previewURL);
                  } catch (error) {
                    console.error('Error creating preview URL:', error);
                  }
                  // Return false to prevent auto-upload
                  return false;
                }}
                onChange={handleBackgroundChange}
                maxCount={1}
                accept="image/*"
                showUploadList={false}
              >
                {!backgroundPreview ? (
                  <Button
                    icon={<UploadOutlined />}
                    style={{ background: '#2563EB', color: '#fff' }}
                  >
                    Select Background
                  </Button>
                ) : (
                  <Button>Change Background</Button>
                )}
              </Upload>

              {backgroundPreview && (
                <div className="mt-4 relative">
                  <img
                    src={backgroundPreview}
                    alt="Background Preview"
                    className="w-64 h-36 object-cover rounded-md border border-gray-300"
                  />
                  <Button
                    type="text"
                    danger
                    className="absolute top-0 right-0 bg-white/70 rounded-full p-1 text-xs"
                    onClick={() => {
                      setBackgroundFile(null);
                      URL.revokeObjectURL(backgroundPreview);
                      setBackgroundPreview(null);
                    }}
                  >
                    ✕
                  </Button>
                </div>
              )}
            </div>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full font-bold"
              style={{ background: '#2563EB', borderColor: '#2563EB' }}
              disabled={loading}
            >
              {loading ? <Spin /> : 'Upload Manga'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UploadManga;
