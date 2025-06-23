import React, { useState, useEffect } from 'react';
import {
  Empty,
  Spin,
  List,
  Button,
  Typography,
  Tag,
  Card,
  Row,
  Col,
  message,
  Layout,
  Carousel,
  Divider,
} from 'antd';
import {
  ClockCircleOutlined,
  BookOutlined,
  EyeOutlined,
  DownOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import * as historyService from '../../../libs/historyService';
import * as userService from '../../../libs/userService';
import * as mangaService from '../../../libs/mangaServices';
import { MangaItem } from '../../../libs/mangaServices';
import * as chapterService from '../../../libs/chapterServices';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { Content } from 'antd/es/layout/layout';
import './readHistory.css';

// Initialize dayjs plugins
dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Title, Text } = Typography;

interface HistoryItem {
  id: number;
  manga: {
    id: number;
    title: string;
    posterUrl?: string;
  };
  chapter: {
    id: number;
    title: string;
    number: number;
  };
  createdAt: string;
}

interface Chapter {
  id: number;
  chapterIndex: number;
  title: string;
  readTimes: number;
  createdAt: string;
  updatedAt: string;
}

interface MangaDetails {
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
  chapters: Chapter[];
  loadingChapters: boolean;
  lastReadChapter?: HistoryItem;
  historyItems: HistoryItem[];
}

const ReadHistory: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [mangaList, setMangaList] = useState<MangaDetails[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedManga, setExpandedManga] = useState<number | null>(null);
  const [recommendedManga, setRecommendedManga] = useState<MangaItem[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] =
    useState<boolean>(false);

  // Effect for initial loading of reading history
  useEffect(() => {
    fetchReadingHistory();
  }, []);

  // Effect to fetch recommendations when mangaList changes
  useEffect(() => {
    if (mangaList.length > 0 && !loading) {
      fetchRecommendations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mangaList, loading]);

  // Function to fetch recommendations based on reading history
  const fetchRecommendations = async () => {
    if (mangaList.length === 0) return;

    try {
      setLoadingRecommendations(true);

      // Get the IDs of the 5 most recently read manga
      const mangaIds = mangaList.slice(0, 5).map(manga => manga.id);

      if (mangaIds.length === 0) {
        setLoadingRecommendations(false);
        return;
      }

      // Fetch recommendations based on these manga
      const recommendations = await mangaService.recommendManga(mangaIds, 5);

      if (recommendations && Array.isArray(recommendations)) {
        // Extract IDs from the recommendations array (handling both number arrays and object arrays)
        const recommendedIds = recommendations.map(item =>
          typeof item === 'number' ? item : Number(item.id),
        );

        // Filter out manga IDs already in the user's reading history to avoid duplication
        const uniqueRecommendedIds = recommendedIds.filter(
          id => !mangaList.some(manga => manga.id === id),
        );

        if (uniqueRecommendedIds.length > 0) {
          // Fetch full details for each manga
          const mangaDetailsPromises = uniqueRecommendedIds.map(id =>
            mangaService.getMangaById(id).catch(() => null),
          );

          const mangaDetailsResults = await Promise.all(mangaDetailsPromises);

          // Filter out any null results from failed fetches
          const validMangaDetails = mangaDetailsResults.filter(Boolean);

          setRecommendedManga(validMangaDetails);
        } else {
          setRecommendedManga([]);
        }
      } else {
        setRecommendedManga([]);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      message.error('Failed to load recommendations');
      setRecommendedManga([]);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const fetchReadingHistory = async () => {
    try {
      setLoading(true);
      const currentUser = userService.getCurrentUser();

      if (!currentUser || !currentUser.userID) {
        setError('Please log in to view your reading history');
        setLoading(false);
        return;
      }

      const historyData = await historyService.getUserReadingHistory(
        currentUser.userID,
      );

      // Group history by manga
      const groupedByManga: { [key: string]: HistoryItem[] } = {};
      historyData.forEach(item => {
        const mangaId = item.manga.id.toString();
        if (!groupedByManga[mangaId]) {
          groupedByManga[mangaId] = [];
        }
        groupedByManga[mangaId].push(item);
      });

      // Sort history items by date
      Object.keys(groupedByManga).forEach(mangaId => {
        groupedByManga[mangaId].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      });

      // Fetch detailed manga information for each manga
      const mangaDetailsPromises = Object.keys(groupedByManga).map(
        async mangaId => {
          try {
            const mangaDetails = await mangaService.getMangaById(
              parseInt(mangaId),
            );
            return {
              ...mangaDetails,
              chapters: [],
              loadingChapters: false,
              lastReadChapter: groupedByManga[mangaId][0], // Most recent reading history
              historyItems: groupedByManga[mangaId],
            };
          } catch (error) {
            console.error(
              `Error fetching manga details for ID ${mangaId}:`,
              error,
            );
            // Return basic info if full details fetch fails
            const basicInfo = groupedByManga[mangaId][0].manga;
            return {
              id: parseInt(mangaId),
              title: basicInfo.title,
              overview: 'Overview not available',
              description: 'Description not available',
              author: 'Unknown author',
              posterUrl: basicInfo.posterUrl || '',
              backgroundUrl: '',
              createdAt: '',
              updatedAt: '',
              genres: [],
              readTimes: 0,
              chapters: [],
              loadingChapters: false,
              lastReadChapter: groupedByManga[mangaId][0],
              historyItems: groupedByManga[mangaId],
            };
          }
        },
      );

      const mangaDetailsResults = await Promise.all(mangaDetailsPromises);
      setMangaList(mangaDetailsResults);
    } catch (error) {
      console.error('Error fetching reading history:', error);
      setError('Failed to load reading history');
    } finally {
      setLoading(false);
    }
  };

  const fetchMangaChapters = async (mangaId: number) => {
    const mangaIndex = mangaList.findIndex(manga => manga.id === mangaId);

    if (mangaIndex === -1) return;

    // If chapters are already loaded, just toggle the expanded state
    if (mangaList[mangaIndex].chapters.length > 0) {
      setExpandedManga(expandedManga === mangaId ? null : mangaId);
      return;
    }

    try {
      // Set loading state for this specific manga
      setMangaList(prev => {
        const updated = [...prev];
        updated[mangaIndex].loadingChapters = true;
        return updated;
      });

      const chapters = await chapterService.getAllChapter(mangaId);

      // Sort chapters by index in descending order to get newest first
      const sortedChapters = [...chapters]
        .sort((a, b) => b.chapterIndex - a.chapterIndex)
        .slice(0, 5); // Get only top 5 newest

      // Update the manga with its chapters
      setMangaList(prev => {
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
        `Failed to load chapters for ${mangaList[mangaIndex].title}`,
      );

      // Reset loading state
      setMangaList(prev => {
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

  const renderEmptyState = () => (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <span className="text-gray-500">
            You haven't read any manga yet. Start reading to build your history!
          </span>
        }
      >
        <Button type="primary" onClick={() => navigate('/')} className="mt-4">
          Discover Manga
        </Button>
      </Empty>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 mb-4">{error}</div>
        <Button type="primary" onClick={() => navigate('/auth/login')}>
          Log In
        </Button>
      </div>
    );
  }

  if (mangaList.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <Title level={2}>Reading History</Title>
            <Link to="/manga">
              <Button type="primary">Browse Manga</Button>
            </Link>
          </div>
          {renderEmptyState()}
        </div>
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
                Reading History
              </Title>
            </div>
            <Link to="/search/manga">
              <Button type="primary">Browse More Manga</Button>
            </Link>
          </div>

          <Row gutter={[16, 16]}>
            {mangaList.map(manga => (
              <Col xs={24} key={manga.id}>
                <Card className="w-full hover:shadow-md transition-shadow duration-300">
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
                        <Link
                          to={`/manga/${manga.id}`}
                          onClick={() => mangaService.handleViewManga(manga.id)}
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
                            Last read:{' '}
                            {manga.lastReadChapter
                              ? dayjs(manga.lastReadChapter.createdAt).fromNow()
                              : 'Unknown'}
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

          {/* Recommended Manga Section */}
          <div className="mt-10">
            <Divider>
              <Title level={2} className="text-center mb-6">
                Recommended For You
              </Title>
            </Divider>

            {loadingRecommendations ? (
              <div className="flex justify-center items-center h-48">
                <Spin size="large" />
              </div>
            ) : recommendedManga.length > 0 ? (
              <div className="mb-8">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <Carousel
                    autoplay
                    dots={{ className: 'custom-dots' }}
                    className="recommended-carousel"
                    slidesToShow={
                      window.innerWidth < 768
                        ? 1
                        : recommendedManga.length < 3
                        ? recommendedManga.length
                        : 3
                    }
                  >
                    {recommendedManga.map(manga => (
                      <div key={manga.id} className="px-2">
                        <Link
                          to={`/manga/${manga.id}`}
                          onClick={() => mangaService.handleViewManga(manga.id)}
                        >
                          <Card
                            hoverable
                            cover={
                              <div
                                className="overflow-hidden"
                                style={{ height: '250px' }}
                              >
                                <img
                                  alt={manga.title}
                                  src={
                                    manga.posterUrl ||
                                    'https://placehold.co/280x400/e2e8f0/1e293b?text=No+Image'
                                  }
                                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                                  onError={e => {
                                    const target = e.target as HTMLImageElement;
                                    target.src =
                                      'https://placehold.co/280x400/e2e8f0/1e293b?text=Error';
                                  }}
                                />
                              </div>
                            }
                            bodyStyle={{ padding: '12px' }}
                          >
                            <Card.Meta
                              title={
                                <div className="truncate font-bold">
                                  {manga.title}
                                </div>
                              }
                              description={
                                <div className="text-xs text-gray-500">
                                  <div className="truncate">
                                    {manga.author || 'Unknown Author'}
                                  </div>
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {manga.genres &&
                                      manga.genres
                                        .slice(0, 2)
                                        .map((genre, idx) => (
                                          <Tag
                                            key={idx}
                                            color={getGenreColor(genre)}
                                            className="mr-0"
                                          >
                                            {genre.replace('_', ' ')}
                                          </Tag>
                                        ))}
                                  </div>
                                </div>
                              }
                            />
                          </Card>
                        </Link>
                      </div>
                    ))}
                  </Carousel>
                  <div className="flex justify-center mt-4">
                    <Link to="/">
                      <Button type="primary" size="large">
                        Discover More
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No recommendations available yet. Keep reading to get personalized suggestions!"
                />
              </div>
            )}
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default ReadHistory;
