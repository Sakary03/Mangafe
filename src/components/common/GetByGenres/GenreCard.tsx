import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Typography } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import * as mangaService from '../../../libs/mangaServices';

const { Text } = Typography;

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

interface GenreCardProps {
  manga: MangaItem;
  rank: number;
}

const GenreCard: React.FC<GenreCardProps> = ({ manga, rank }) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const handleImageError = () => {
    setImageError(true);
  };

  // Handle card click and track view
  const handleCardClick = async () => {
    try {
      // Track view by calling the API
      await mangaService.handleViewManga(manga.id);
      console.log(`View tracked for manga ${manga.id}`);
      // Navigate to the manga detail page
      navigate(`/manga/${manga.id}`);
    } catch (error) {
      console.error('Error tracking view:', error);
      // Still navigate even if tracking fails
      navigate(`/manga/${manga.id}`);
    }
  };

  // Get appropriate color for genre tag
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

  return (
    <div
      className="group relative h-full cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Rank badge */}
      <div className="absolute top-2 left-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 font-bold text-white shadow-md">
        {rank}
      </div>

      <div className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        {/* Image */}
        <div className="relative overflow-hidden pb-[133%]">
          <img
            src={imageError ? `/api/placeholder/240/320` : manga.posterUrl}
            alt={manga.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
          />
        </div>

        {/* Content */}
        <div className="flex flex-grow flex-col p-3">
          <h3 className="mb-1 line-clamp-1 font-bold">{manga.title}</h3>
          <div className="text-xs text-gray-600 mb-2">
            {manga.author || 'Unknown Author'}
          </div>

          {/* Reads count */}
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center rounded-full bg-blue-50 px-2 py-0.5">
              <EyeOutlined className="mr-1 text-xs text-blue-500" />
              <Text className="text-xs font-medium text-blue-700">
                {manga.readTimes}
              </Text>
            </div>

            {/* Primary genre tag */}
            {manga.genres[0] && (
              <Tag
                color={getGenreColor(manga.genres[0])}
                className="rounded-full py-0 px-2 text-xs m-0"
              >
                {manga.genres[0].replace(/_/g, ' ')}
              </Tag>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenreCard;
