import React, { useEffect, useState } from 'react';
import {
  Breadcrumb,
  Button,
  FloatButton,
  Layout,
  Spin,
  Switch,
  Typography,
} from 'antd';
import {
  ArrowUpOutlined,
  LeftOutlined,
  RightOutlined,
  VerticalAlignMiddleOutlined,
  FileImageOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import * as mangaService from '../../../libs/mangaServices';
import * as chapterService from '../../../libs/chapterServices';
import * as historyService from '../../../libs/historyService';
import { getCurrentUser } from '../../../libs/userService';
import { Content } from 'antd/es/layout/layout';

const MangaChapterReader: React.FC = () => {
  const { mangaId, chapterIndex } = useParams<{
    mangaId: string;
    chapterIndex: string;
  }>();
  const navigate = useNavigate();

  const mangaIdNumber = parseInt(mangaId || '0');
  const chapterIndexNumber = parseInt(chapterIndex || '0');

  const [mangaDetail, setMangaDetail] = useState<any>(null);
  const [chapterDetail, setChapterDetail] =
    useState<chapterService.ChapterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readingMode, setReadingMode] = useState<'scroll' | 'paged'>('scroll');
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [manga, chapter, chapterlist] = await Promise.all([
          mangaService.getMangaById(mangaIdNumber),
          chapterService.getChapter(mangaIdNumber, chapterIndexNumber),
          chapterService.getAllChapter(mangaIdNumber),
        ]);

        if (manga && chapter) {
          setMangaDetail(() => {
            if (!manga) return null;
            return {
              ...manga,
              chapters: chapterlist,
            };
          });
          setChapterDetail(chapter);

          // Record reading history if user is logged in
          const currentUser = getCurrentUser();
          if (currentUser && currentUser.id) {
            try {
              await historyService.recordChapterRead(
                currentUser.id,
                mangaIdNumber,
                chapter.id,
              );
              console.log('Reading history recorded');
            } catch (historyError) {
              console.error('Failed to record reading history:', historyError);
              // Non-critical error, don't show to user
            }
          }
        } else {
          setError('Failed to load data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load manga chapter');
      } finally {
        setLoading(false);
      }
    };

    if (mangaId && chapterIndex) {
      fetchData();
    }
  }, [mangaId, chapterIndex, mangaIdNumber, chapterIndexNumber]);

  const recordChapterHistory = async (targetChapterId: number) => {
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id) {
      try {
        await historyService.recordChapterRead(
          currentUser.id,
          mangaIdNumber,
          targetChapterId,
        );
      } catch (error) {
        console.error('Error recording reading history:', error);
      }
    }
  };

  const handlePrevChapter = () => {
    if (chapterIndexNumber > 1) {
      const prevChapterNumber = chapterIndexNumber - 1;
      // Find the previous chapter in the list
      if (mangaDetail && mangaDetail.chapters) {
        const prevChapter = mangaDetail.chapters.find(
          (ch: any) =>
            ch.chapterIndex === prevChapterNumber ||
            ch.number === prevChapterNumber,
        );

        if (prevChapter) {
          recordChapterHistory(prevChapter.id);
        }
      }
      navigate(`/manga/${mangaIdNumber}/chapter/${prevChapterNumber}`);
    }
  };

  const handleNextChapter = () => {
    if (mangaDetail && chapterIndexNumber < mangaDetail.chapters.length) {
      const nextChapterNumber = chapterIndexNumber + 1;
      // Find the next chapter in the list
      const nextChapter = mangaDetail.chapters.find(
        (ch: any) =>
          ch.chapterIndex === nextChapterNumber ||
          ch.number === nextChapterNumber,
      );

      if (nextChapter) {
        recordChapterHistory(nextChapter.id);
      }

      navigate(`/manga/${mangaIdNumber}/chapter/${nextChapterNumber}`);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const toggleReadingMode = (checked: boolean) => {
    setReadingMode(checked ? 'paged' : 'scroll');
    setCurrentPage(0);
  };

  // Keyboard navigation for paged mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (readingMode !== 'paged' || !chapterDetail?.pages) return;

      if (e.key === 'ArrowRight' || e.key === 'd') {
        // Next page
        setCurrentPage(prev =>
          Math.min(chapterDetail.pages!.length - 1, prev + 1),
        );
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        // Previous page
        setCurrentPage(prev => Math.max(0, prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [readingMode, chapterDetail]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 py-8">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !mangaDetail || !chapterDetail) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">
            {error || 'Failed to load chapter'}
          </h2>
          <Button type="primary" onClick={() => navigate('/')} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Manga',
      href: '/search/manga',
    },
    {
      title: mangaDetail.title,
      href: `/manga/${mangaIdNumber}`,
    },
    {
      title: `Chapter ${chapterIndexNumber}`,
    },
  ];

  return (
    <Layout className="bg-gray-100 min-h-screen">
      <Content>
        {/* Empty space to fix breadcrumb visibility */}
        <div style={{ height: '65px' }}></div>

        {/* Header group - breadcrumb, title, and controls */}
        <div className="bg-white shadow-md border-b border-gray-200 mb-4">
          <div className="max-w-6xl mx-auto px-4 py-4">
            {/* Breadcrumb row */}
            <div className="flex justify-between items-center mb-3">
              <div className="breadcrumb-container">
                <Breadcrumb
                  items={breadcrumbItems}
                  className="text-base md:text-lg font-medium"
                  separator=">"
                />
                <style jsx>{`
                  :global(.ant-breadcrumb) {
                    line-height: 1.5;
                    display: flex;
                    flex-wrap: wrap;
                  }
                  :global(.ant-breadcrumb a) {
                    color: #3366cc;
                    font-weight: 500;
                  }
                  :global(.ant-breadcrumb > span:last-child) {
                    color: #666;
                    font-weight: 600;
                  }
                  :global(.ant-breadcrumb-separator) {
                    margin: 0 0.5em;
                    color: #666;
                  }
                `}</style>
              </div>
              <Button
                type="primary"
                size="large"
                onClick={() => navigate(`/manga/${mangaIdNumber}`)}
                icon={<FileImageOutlined />}
              >
                View Manga Details
              </Button>
            </div>

            {/* Title row */}
            <div className="mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {`${mangaDetail.title} - Chapter ${chapterIndexNumber}`}
                {chapterDetail.title && `: ${chapterDetail.title}`}
              </h1>
            </div>

            {/* Navigation and reading mode row */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
              <div className="flex gap-4">
                <Button
                  type="primary"
                  onClick={handlePrevChapter}
                  disabled={chapterIndexNumber <= 1}
                  icon={<LeftOutlined />}
                >
                  Prev
                </Button>
                <Button
                  type="primary"
                  onClick={handleNextChapter}
                  disabled={chapterIndexNumber >= mangaDetail.chapters.length}
                >
                  Next <RightOutlined />
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-medium">Reading Mode:</span>
                <Switch
                  checked={readingMode === 'paged'}
                  onChange={toggleReadingMode}
                  checkedChildren={<FileImageOutlined />}
                  unCheckedChildren={<VerticalAlignMiddleOutlined />}
                />
                <span className="text-gray-600">
                  {readingMode === 'scroll' ? 'Continuous' : 'Paged'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter content starts here */}

        {/* Chapter Info (Images) */}
        <div className="max-w-4xl mx-auto px-4">
          {readingMode === 'scroll' ? (
            // Scroll mode - display all images one after another
            chapterDetail.pages?.map((image, index) => (
              <div key={index} className="mb-4">
                <img
                  src={image}
                  alt={`Page ${index + 1}`}
                  className="w-full block shadow-md"
                  loading="lazy"
                />
              </div>
            ))
          ) : (
            // Paged mode - display single page with navigation
            <div className="grid grid-cols-1 gap-4">
              {chapterDetail.pages && chapterDetail.pages.length > 0 && (
                <>
                  <div className="aspect-w-16 aspect-h-9 relative">
                    <img
                      src={chapterDetail.pages[currentPage]}
                      alt={`Page ${currentPage + 1}`}
                      className="w-full h-full object-contain block shadow-md mx-auto"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <Button
                      onClick={() =>
                        setCurrentPage(prev => Math.max(0, prev - 1))
                      }
                      disabled={currentPage === 0}
                      icon={<LeftOutlined />}
                    >
                      Previous Page
                    </Button>
                    <span className="font-medium">
                      Page {currentPage + 1} of {chapterDetail.pages.length}
                    </span>
                    <Button
                      onClick={() =>
                        setCurrentPage(prev =>
                          Math.min(chapterDetail.pages!.length - 1, prev + 1),
                        )
                      }
                      disabled={currentPage === chapterDetail.pages.length - 1}
                      icon={<RightOutlined />}
                    >
                      Next Page
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Chapter Title (Again) */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {chapterDetail.title}
          </h2>
        </div>

        {/* Navigation Buttons (Bottom) */}
        <div className="max-w-6xl mx-auto px-4 py-6 mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-4">
              <Button
                type="primary"
                onClick={handlePrevChapter}
                disabled={chapterIndexNumber <= 1}
                icon={<LeftOutlined />}
              >
                Prev
              </Button>
              <Button
                type="primary"
                onClick={handleNextChapter}
                disabled={chapterIndexNumber >= mangaDetail.chapters.length}
              >
                Next <RightOutlined />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="default"
                onClick={() => navigate(`/manga/${mangaIdNumber}`)}
                icon={<FileImageOutlined />}
              >
                Back to Manga
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Action Buttons */}
        <FloatButton.Group
          trigger="hover"
          className="fixed bottom-8 right-8"
          icon={<ArrowUpOutlined />}
        >
          <FloatButton
            icon={<ArrowUpOutlined />}
            tooltip="Back to Top"
            onClick={scrollToTop}
          />
          <FloatButton
            icon={<FileImageOutlined />}
            tooltip="View Manga Details"
            onClick={() => navigate(`/manga/${mangaIdNumber}`)}
          />
        </FloatButton.Group>
      </Content>
    </Layout>
  );
};

export default MangaChapterReader;
