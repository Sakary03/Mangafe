import { useState } from 'react';
import { Tag, Typography, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { EyeOutlined } from '@ant-design/icons';

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

  const handleImageError = () => {
    setImageError(true);
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
    <Link to={`/manga/${manga.id}`}>
      <div className="relative group w-full">
        {/* Horizontal card layout */}
        <div className="flex bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-32">
          {/* Rank badge */}
          <div
            className="absolute top-2 left-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-600 z-10 
                     flex items-center justify-center text-white font-bold rounded-full shadow-md text-sm"
          >
            {rank}
          </div>

          {/* Left side - Poster image */}
          <div className="w-24 h-32 flex-shrink-0 relative">
            <img
              alt={manga.title}
              src={imageError ? `/api/placeholder/240/320` : manga.posterUrl}
              onError={handleImageError}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right side - Content */}
          <div className="flex-grow p-3 flex flex-col justify-between">
            {/* Title and author */}
            <div>
              <div className="font-bold text-base line-clamp-1 mb-1">
                {manga.title}
              </div>
              <div className="text-xs text-gray-600 mb-2">
                {manga.author || 'Unknown Author'}
              </div>
            </div>

            {/* Stats and tags */}
            <div className="space-y-2">
              {/* Stats row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center bg-blue-50 rounded-full px-2 py-0.5">
                  <EyeOutlined className="mr-1 text-blue-500 text-xs" />
                  <Text className="text-xs font-medium text-blue-700">
                    {manga.readTimes}
                  </Text>
                </div>

                {manga.status === 'APPROVED' ? (
                  <Tag
                    color="green"
                    className="rounded-full py-0 px-2 text-xs m-0"
                  >
                    {manga.status}
                  </Tag>
                ) : (
                  <Tag
                    color="gold"
                    className="rounded-full py-0 px-2 text-xs m-0"
                  >
                    {manga.status}
                  </Tag>
                )}
              </div>

              {/* Genre tags */}
              <div className="flex flex-wrap gap-1">
                {manga.genres.slice(0, 2).map((genre, idx) => (
                  <Tag
                    color={getGenreColor(genre)}
                    key={idx}
                    className="rounded-full text-xs py-0 px-2 m-0"
                  >
                    {genre.replace(/_/g, ' ')}
                  </Tag>
                ))}
                {manga.genres.length > 2 && (
                  <Tooltip title={allGenresText} placement="bottom">
                    <Tag className="rounded-full text-xs py-0 px-2 m-0 cursor-pointer">
                      +{manga.genres.length - 2}
                    </Tag>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
