import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Card,
  Empty,
  Pagination,
  Spin,
  message,
  Button,
  Typography,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import * as mangaService from '../../../libs/mangaServices';
import * as userService from '../../../libs/userService';

const { Title, Text } = Typography;
const { Meta } = Card;

const UploadedManga: React.FC = () => {
  const [mangas, setMangas] = useState<mangaService.MangaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const user = userService.getCurrentUser();
  const userId = user ? user.userID || user.id : null;
  const fetchMangas = async (page: number) => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const offset = (page - 1) * pageSize;
      const query: mangaService.SearchMangaDTO = {
        uploadedBy: parseInt(userId),
      };

      const data = await mangaService.searchManga(query, offset, pageSize);
      setMangas(data.content || []);
      setTotal(data.totalElements || 0);
    } catch (err) {
      console.error('Error fetching manga:', err);
      setError('Failed to load manga. Please try again later.');
      message.error('Failed to load manga.');
    } finally {
      setLoading(false);
    }
  };

  const checkCurrentUser = async () => {
    try {
      const user = await userService.getCurrentUser();
      setCurrentUser(user);
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  useEffect(() => {
    checkCurrentUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchMangas(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, currentPage, pageSize]);

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };

  const handleDelete = async (id: number) => {
    try {
      await mangaService.deleteManga(id);
      message.success('Manga deleted successfully');
      fetchMangas(currentPage);
    } catch (err) {
      console.error('Error deleting manga:', err);
      message.error('Failed to delete manga.');
    }
  };

  const isOwner =
    currentUser && userId && currentUser.userID === parseInt(userId);

  if (loading && !mangas.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error && !mangas.length) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Title level={4} className="text-red-500">
          {error}
        </Title>
        <Button type="primary" onClick={() => fetchMangas(currentPage)}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Title level={2} className="mb-0">
          {isOwner ? 'My Uploaded Manga' : 'User Uploaded Manga'}
        </Title>

        {isOwner && (
          <Link to="/upload-manga">
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Upload New Manga
            </Button>
          </Link>
        )}
      </div>

      {mangas.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text className="text-gray-500">
              {isOwner
                ? "You haven't uploaded any manga yet."
                : "This user hasn't uploaded any manga yet."}
            </Text>
          }
        >
          {isOwner && (
            <Link to="/upload-manga">
              <Button type="primary" className="bg-blue-600 hover:bg-blue-700">
                Upload Your First Manga
              </Button>
            </Link>
          )}
        </Empty>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {mangas.map(manga => (
              <Card
                key={manga.id}
                hoverable
                className="overflow-hidden h-full flex flex-col"
                cover={
                  <div className="h-56 overflow-hidden relative">
                    <img
                      alt={manga.title}
                      src={manga.posterUrl}
                      className="w-full h-full object-cover"
                    />
                  </div>
                }
                actions={
                  isOwner
                    ? [
                        <Link to={`/manga/${manga.id}`} key="view">
                          <EyeOutlined />
                        </Link>,
                        <Link to={`/edit-manga/${manga.id}`} key="edit">
                          <EditOutlined />
                        </Link>,
                        <DeleteOutlined
                          key="delete"
                          onClick={() => handleDelete(manga.id)}
                          className="text-red-500"
                        />,
                      ]
                    : [
                        <Link to={`/manga/${manga.id}`} key="view">
                          <EyeOutlined />
                        </Link>,
                      ]
                }
              >
                <Meta
                  title={
                    <div className="truncate font-bold">{manga.title}</div>
                  }
                  description={
                    <div className="truncate text-sm text-gray-500">
                      {manga.overview}
                    </div>
                  }
                />
                <div className="mt-2 flex flex-wrap gap-1">
                  {manga.genres.slice(0, 2).map((genre, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                  {manga.genres.length > 2 && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full">
                      +{manga.genres.length - 2}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              onChange={handlePageChange}
              showSizeChanger
              showQuickJumper
            />
          </div>
        </>
      )}
    </div>
  );
};

export default UploadedManga;
