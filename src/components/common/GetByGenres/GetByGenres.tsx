import React, { useState, useEffect } from 'react';
import { Tabs, Spin, Empty } from 'antd';
import { Link } from 'react-router-dom';
import * as mangaService from '../../../libs/mangaServices';
import GenreCard from './GenreCard';

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
  status: string;
}

const GetByGenres: React.FC = () => {
  const [activeGenre, setActiveGenre] = useState<string>('ACTION');
  const [mangaList, setMangaList] = useState<MangaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cachedManga, setCachedManga] = useState<Record<string, MangaItem[]>>(
    {},
  );
  const [initialLoad, setInitialLoad] = useState<boolean>(true);

  const popularGenres = [
    'ACTION',
    'ROMANCE',
    'FANTASY',
    'COMEDY',
    'ADVENTURE',
    'HORROR',
    'DRAMA',
    'SCI_FI',
    'SUPERNATURAL',
  ];

  useEffect(() => {
    const fetchMangaByGenre = async () => {
      if (cachedManga[activeGenre] && !initialLoad) {
        setMangaList(cachedManga[activeGenre]);
        return;
      }

      setLoading(true);
      try {
        const searchDto: mangaService.SearchMangaDTO = {
          genres: [activeGenre],
          status: ['APPROVED'],
        };

        const results = await mangaService.searchManga(searchDto, 0, 5);
        const sortedResults = [...results].sort(
          (a, b) => b.readTimes - a.readTimes,
        );

        setMangaList(sortedResults);

        setCachedManga(prev => ({
          ...prev,
          [activeGenre]: sortedResults,
        }));

        if (initialLoad) {
          setInitialLoad(false);
        }
      } catch (error) {
        console.error('Error fetching manga by genre:', error);
        setMangaList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMangaByGenre();
  }, [activeGenre, initialLoad]);

  const handleGenreChange = (genre: string) => {
    setActiveGenre(genre);
  };

  const formatGenreName = (genre: string) => {
    return genre.replace(/_/g, ' ');
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Browse by Genre</h2>
          <Link
            to="/search/manga"
            className="text-blue-600 hover:underline text-sm"
          >
            View All Genres
          </Link>
        </div>

        <Tabs
          activeKey={activeGenre}
          onChange={handleGenreChange}
          tabPosition="top"
          className="genres-tabs"
          items={popularGenres.map(genre => ({
            label: formatGenreName(genre),
            key: genre,
          }))}
        />

        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex justify-center py-12">
              <Spin size="large" />
            </div>
          ) : mangaList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6 transition-all duration-300">
              {mangaList.map((manga, index) => (
                <GenreCard key={manga.id} manga={manga} rank={index + 1} />
              ))}
            </div>
          ) : (
            <Empty
              description={`No manga found for ${formatGenreName(activeGenre)}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GetByGenres;
