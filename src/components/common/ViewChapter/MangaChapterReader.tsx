import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, FloatButton, Layout, Spin } from 'antd';
import { ArrowUpOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import * as mangaService from '../../../libs/mangaServices';
import * as chapterService from '../../../libs/chapterServices';
import { Content } from 'antd/es/layout/layout';

const MangaChapterReader: React.FC = () => {
  const { mangaId, chapterIndex } = useParams<{ mangaId: string; chapterIndex: string }>();
  const navigate = useNavigate();

  const mangaIdNumber = parseInt(mangaId || '0');
  const chapterIndexNumber = parseInt(chapterIndex || '0');

  const [mangaDetail, setMangaDetail] = useState();
  const [chapterDetail, setChapterDetail] = useState<chapterService.ChapterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handlePrevChapter = () => {
    if (chapterIndexNumber > 1) {
      navigate(`/manga/${mangaIdNumber}/chapter/${chapterIndexNumber - 1}`);
    }
  };

  const handleNextChapter = () => {
    if (mangaDetail && chapterIndexNumber < mangaDetail.chapters.length) {
      navigate(`/manga/${mangaIdNumber}/chapter/${chapterIndexNumber + 1}`);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 py-8">
        <Spin size="large" tip="Loading chapter..." />
      </div>
    );
  }

  if (error || !mangaDetail || !chapterDetail) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">{error || 'Failed to load chapter'}</h2>
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
        {/* Breadcrumb */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <Breadcrumb items={breadcrumbItems} className="text-lg" />
          </div>
        </div>

        {/* Chapter Title */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">{chapterDetail.title}</h1>
        </div>

        {/* Navigation Buttons */}
        <div className="max-w-6xl mx-auto px-4 mb-8">
          <div className="flex justify-between gap-4">
            <Button
              type="primary"
              size="large"
              onClick={handlePrevChapter}
              disabled={chapterIndexNumber <= 1}
              icon={<LeftOutlined />}
              className="min-w-[150px]"
            >
              Previous Chapter
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={handleNextChapter}
              disabled={chapterIndexNumber >= mangaDetail.chapters.length}
              className="min-w-[150px]"
            >
              Next Chapter
              <RightOutlined />
            </Button>
          </div>
        </div>

        {/* Chapter Info (Images) */}
        <div className="max-w-4xl mx-auto px-4">
          {chapterDetail.pages?.map((image, index) => (
            <div key={index} className="mb-4">
              <img
                src={image}
                alt={`Page ${index + 1}`}
                className="w-full block shadow-md"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Chapter Title (Again) */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h2 className="text-2xl font-bold text-gray-800">{chapterDetail.title}</h2>
        </div>

        {/* Navigation Buttons (Bottom) */}
        <div className="max-w-6xl mx-auto px-4 mb-12">
          <div className="flex justify-between gap-4">
            <Button
              type="primary"
              size="large"
              onClick={handlePrevChapter}
              disabled={chapterIndexNumber <= 1}
              icon={<LeftOutlined />}
              className="min-w-[150px]"
            >
              Previous Chapter
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={handleNextChapter}
              disabled={chapterIndexNumber >= mangaDetail.chapters.length}
              className="min-w-[150px]"
            >
              Next Chapter
              <RightOutlined />
            </Button>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <FloatButton
          icon={<ArrowUpOutlined />}
          type="primary"
          onClick={scrollToTop}
          className="fixed bottom-8 right-8"
        />
      </Content>
    </Layout>
  );
};

export default MangaChapterReader;
