/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { Tag, Typography, Tooltip } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
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
  uploadedBy: {
    id: number;
    fullName: string;
    userName: string;
    role: string;
    email: string;
    avatarUrl?: string;
  } | null;
  status: string;
}

interface MostViewCardProps {
  manga: MangaItem;
  rank: number;
}

export function MostViewCard({ manga, rank }: MostViewCardProps) {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const handleImageError = () => {
    setImageError(true);
  };

  const handleCardClick = async () => {
    // Track view by calling the API
    await mangaService.handleViewManga(manga.id);
    console.log(`Navigating to manga ${manga.id}`);
    navigate(`/manga/${manga.id}`);
  };

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

  const allGenresText = manga.genres
    .map(genre => genre.replace(/_/g, ' '))
    .join(', ');

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden flex h-36 transform transition-all duration-300 hover:shadow-xl hover:scale-102 hover:-translate-y-1 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Rank indicator */}
      <div className="w-12 flex items-center justify-center" style={{ backgroundColor: '#1F2937' }}>
        <span className="text-white font-bold text-2xl">{rank}</span>
      </div>

      {/* Image */}
      <div className="w-24 h-full flex-shrink-0">
        <img
          src={imageError ? `/api/placeholder/240/320` : manga.posterUrl}
          alt={manga.title}
          onError={handleImageError}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-3 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg line-clamp-1">{manga.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-1">
            By {manga.author || 'Unknown'}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {manga.genres &&
              manga.genres.slice(0, 2).map((genre, index) => (
                <span
                  key={index}
                  className="text-xs bg-blue-50 text-blue-600 rounded px-1 py-0.5"
                >
                  {genre}
                </span>
              ))}
            {manga.genres && manga.genres.length > 2 && (
              <span className="text-xs bg-gray-100 text-gray-600 rounded px-1 py-0.5">
                +{manga.genres.length - 2}
              </span>
            )}
          </div>

          <div className="flex items-center">
            <EyeOutlined className="mr-1 text-blue-500 text-xs" />
            <span className="text-sm text-gray-600 ml-1">
              {manga.readTimes || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
