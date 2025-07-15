import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Empty,
  Spin,
  List,
  Tag,
  message,
} from 'antd';
import {
  BookOutlined,
  ClockCircleOutlined,
  DownOutlined,
  EyeOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { getUserFollowedManga } from '../../../libs/followService';
import { getCurrentUser } from '../../../libs/userService';
import { getAllChapter } from '../../../libs/chapterServices';
import { handleViewManga } from '../../../libs/mangaServices';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

interface FollowedManga {
  id: number;
  title: string;
  overview: string;
  description: string;
  author: string;
  posterUrl: string;
  backgroundUrl: string;
  createdAt: string;
  updatedAt: string;
  genres: string[];
  readTimes: number;
  uploadedBy: number | null;
  status: string;
}

interface Chapter {
  id: number;
  chapterIndex: number;
  title: string;
  readTimes: number;
  createdAt: string;
  updatedAt: string;
}

interface MangaWithChapters extends FollowedManga {
  chapters: Chapter[];
  loadingChapters: boolean;
}

const Following: React.FC = () => {
  const [followedManga, setFollowedManga] = useState<MangaWithChapters[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedManga, setExpandedManga] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserFollowedManga();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserFollowedManga = async () => {
    try {
      setLoading(true);
      const currentUser = getCurrentUser();
      const userId = currentUser?.userID || currentUser?.id;

      if (!userId) {
        message.error('You need to be logged in to view your followed manga');
        navigate('/auth/login');
        return;
      }

      const response = await getUserFollowedManga(userId);
      if (response && response.content) {
        const mangaList = response.content.map((manga: FollowedManga) => ({
          ...manga,
          chapters: [],
          loadingChapters: false,
        }));
        setFollowedManga(mangaList);
      }
    } catch (error) {
      console.error('Error fetching followed manga:', error);
      message.error('Failed to load followed manga');
    } finally {
      setLoading(false);
    }
  };

  const fetchMangaChapters = async (mangaId: number) => {
    const mangaIndex = followedManga.findIndex(manga => manga.id === mangaId);

    if (mangaIndex === -1) return;

    // If chapters are already loaded, just toggle the expanded state
    if (followedManga[mangaIndex].chapters.length > 0) {
      setExpandedManga(expandedManga === mangaId ? null : mangaId);
      return;
    }

    try {
      // Set loading state for this specific manga
      setFollowedManga(prev => {
        const updated = [...prev];
        updated[mangaIndex].loadingChapters = true;
        return updated;
      });

      const chapters = await getAllChapter(mangaId);

      // Sort chapters by index in descending order to get newest first
      const sortedChapters = [...chapters]
        .sort((a, b) => b.chapterIndex - a.chapterIndex)
        .slice(0, 5); // Get only top 5 newest

      // Update the manga with its chapters
      setFollowedManga(prev => {
        const updated = [...prev];
        updated[mangaIndex] = {
          ...updated[mangaIndex],
          chapters: sortedChapters,
          loadingChapters: false,
        };
        return updated;
      });

      // Set this manga as expanded
      setExpandedManga(mangaId);
    } catch (error) {
      console.error('Error fetching manga chapters:', error);
      message.error(
        `Failed to load chapters for ${followedManga[mangaIndex].title}`,
      );

      // Reset loading state
      setFollowedManga(prev => {
        const updated = [...prev];
        updated[mangaIndex].loadingChapters = false;
        return updated;
      });
    }
  };

  const navigateToChapter = (mangaId: number, chapterIndex: number) => {
    navigate(`/manga/${mangaId}/chapter/${chapterIndex}`);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <Title level={2}>My Followed Manga</Title>
          <Link to="/search/manga">
            <Button type="primary">Explore New Manga</Button>
          </Link>
        </div>

        {followedManga.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Empty
              description="You haven't followed any manga yet"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
            <Link to="/search/manga">
              <Button type="primary" className="mt-4">
                Browse Manga
              </Button>
            </Link>
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {followedManga.map(manga => (
              <Col xs={24} key={manga.id}>
                <Card
                  className="w-full hover:shadow-md transition-shadow duration-300"
                  bodyStyle={{ padding: '16px' }}
                >
                  <div className="flex">
                    {/* Manga poster */}
                    <Link
                      to={`/manga/${manga.id}`}
                      onClick={() => handleViewManga(manga.id)}
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
                        <Link
                          to={`/manga/${manga.id}`}
                          onClick={() => handleViewManga(manga.id)}
                        >
                          <Title
                            level={4}
                            className="mb-1 hover:text-blue-600 transition-colors"
                          >
                            {manga.title}
                          </Title>
                        </Link>
                        <div className="text-gray-500 mb-2">
                          by {manga.author || 'Unknown Author'}
                        </div>

                        {/* Genres */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {manga.genres.slice(0, 3).map((genre, idx) => (
                            <Tag
                              key={idx}
                              color={getGenreColor(genre)}
                              className="mr-0"
                            >
                              {genre.replace('_', ' ')}
                            </Tag>
                          ))}
                          {manga.genres.length > 3 && (
                            <Tag className="mr-0">
                              +{manga.genres.length - 3}
                            </Tag>
                          )}
                        </div>

                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {manga.overview}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <EyeOutlined className="mr-1" />
                            {manga.readTimes} reads
                          </span>
                          <span className="flex items-center">
                            <ClockCircleOutlined className="mr-1" />
                            {dayjs(manga.updatedAt).fromNow()}
                          </span>
                        </div>

                        <Button
                          type={
                            expandedManga === manga.id ? 'primary' : 'default'
                          }
                          icon={<UnorderedListOutlined />}
                          onClick={() => fetchMangaChapters(manga.id)}
                          loading={manga.loadingChapters}
                        >
                          Chapters <DownOutlined />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Chapters dropdown section */}
                  {expandedManga === manga.id && (
                    <div className="mt-4 border-t pt-4">
                      <Title level={5} className="mb-3 flex items-center">
                        <BookOutlined className="mr-2" /> Latest Chapters
                      </Title>
                      {manga.chapters.length > 0 ? (
                        <List
                          dataSource={manga.chapters}
                          className="bg-gray-50 rounded-lg"
                          renderItem={chapter => (
                            <List.Item
                              className="hover:bg-gray-100 cursor-pointer transition-colors"
                              onClick={() =>
                                navigateToChapter(
                                  manga.id,
                                  chapter.chapterIndex,
                                )
                              }
                            >
                              <div className="flex justify-between w-full px-2 py-1">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-blue-600 rounded-full text-white flex items-center justify-center mr-3">
                                    {chapter.chapterIndex}
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      Chapter {chapter.chapterIndex}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {chapter.title ||
                                        `Chapter ${chapter.chapterIndex}`}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500 flex items-center">
                                  <EyeOutlined className="mr-1" />{' '}
                                  {chapter.readTimes}
                                  <div className="mx-2">•</div>
                                  <Text className="italic">
                                    {dayjs(chapter.createdAt).format(
                                      'MMM D, YYYY',
                                    )}
                                  </Text>
                                </div>
                              </div>
                            </List.Item>
                          )}
                        />
                      ) : (
                        <Empty
                          description="No chapters available"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          className="my-4"
                        />
                      )}

                      <div className="flex justify-center mt-3">
                        <Link to={`/manga/${manga.id}`}>
                          <Button>View All Chapters</Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default Following;
