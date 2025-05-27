import { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { getAllManga } from '../../../libs/mangaServices';
import { MostViewCard } from './MostViewCard';
import { Link } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';

interface MangaItem {
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
  uploadedBy: {
    id: number;
    fullName: string;
    userName: string;
    email: string;
    role: string;
    avatarUrl?: string;
  } | null;
  status: string;
}

export default function MostViews() {
  const [manga, setManga] = useState<MangaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMostViewedManga = async () => {
      try {
        setLoading(true);
        // Fetch manga sorted by readTimes in descending order (isAsc=false)
        const response = await getAllManga(0, 9, 'readTimes', false);
        setManga(response);
      } catch (error) {
        console.error('Error fetching most viewed manga:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMostViewedManga();
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#276CEE] to-[#1A4FC0] flex flex-col items-center py-8">
      <div className="w-full max-w-[80%] px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center mb-8">
          <h1 className="text-4xl font-bold text-white relative">
            Most Popular Manga
            <div className="h-1 w-16 bg-white mt-2 rounded-full"></div>
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {manga.map((item, index) => (
              <MostViewCard key={item.id} manga={item} rank={index + 1} />
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <Link to="/">
            <button className="group inline-flex items-center px-6 py-3 text-lg font-medium text-blue-600 hover:text-blue-700 bg-white hover:bg-gray-50 rounded-full border border-blue-200 hover:border-blue-300 transition-all duration-200">
              Show More
              <RightOutlined className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
