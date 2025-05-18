// 📁 src/pages/MangaDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import MangaBanner from './MangaBanner';
import MangaTag from './MangaTag';
import MangaInfo from './MangaInfo';
import ChapterList from './ChapterList';
import RelatedManga from './RelatedManga';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import * as MangaService from '../../../libs/mangaServices'
import * as ChapterService from '../../../libs/chapterServices';
import { parse } from 'path';
import CommentSection from './CommentSection';
const { Content } = Layout;

export interface MangaDetail {
  id: number;
  title: string;
  overview: string;
  description: string;
  author: string;
  posterUrl: string;
  backgroundUrl: string;
  createdAt: string;
  updatedAt: string;
  chapters: Chapter[];
  genres: string[];
}

export interface Chapter {
  id: number;
  chapterIndex: number;
  pages: string[];
  title: string;
  readTimes: number;
  createdAt: string;
  updatedAt: string;
}

const MangaDetailPage: React.FC = () => {
  const [manga, setManga] = useState<MangaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const idString = useParams<{ mangaId: string }>();
  const mangaId = parseInt(idString.mangaId || '');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  console.log('Checking mangaId', mangaId);
  useEffect(() => {
    const fetchMangaDetail = async () => {
      try {
        const response = await MangaService.getMangaById(mangaId);
        const chapters = await ChapterService.getAllChapter(mangaId);
        setManga(() => {
          if (!response) return null;
          return {
            ...response,
            chapters: chapters,
          };
        });
        console.log('Checking manga detail', manga);
      } catch (error) {
        console.error('Error fetching manga detail:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
    fetchMangaDetail();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  if (loading) return <div>Loading...</div>;
  if (!manga) return <div>Manga not found</div>;

  return (
    <Layout className="bg-gray-100 min-h-screen">
      <Content>
        <MangaBanner
          id={manga.id}
          title={manga.title}
          poster={manga.posterUrl}
          background={manga.backgroundUrl}
          author={manga.author}
          numberOfChapters={manga.chapters?.length}
          isLoggedIn={isLoggedIn}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <MangaTag genres={manga.genres} />
              <MangaInfo
                overview={manga.overview}
                description={manga.description}
              />
              <ChapterList chapters={manga.chapters} mangaId={manga.id} />
              <br></br>
              <CommentSection mangaId={manga.id} />
            </div>
            <div className="lg:w-1/3">
              <RelatedManga currentMangaId={manga.id} />
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default MangaDetailPage;