import React from 'react';
import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import * as mangaService from '../../../libs/mangaServices';

export interface NewestCardProps {
  id: number;
  title: string;
  backgroundUrl: string;
  posterUrl: string;
  overview: string;
  genres: string[];
  description: string;
  author?: string;
}

const NewestCard: React.FC<NewestCardProps> = mangaDetail => {
  const navigate = useNavigate();
  const handleCardClick = async () => {
    await mangaService.handleViewManga(mangaDetail.id);
    console.log(`Navigating to manga ${mangaDetail.id}`);
    navigate(`/manga/${mangaDetail.id}`);
  };

  return (
    <div
      style={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
      }}
      onMouseEnter={e => {
        const card = e.currentTarget;
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={e => {
        const card = e.currentTarget;
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'none';
      }}
      onClick={handleCardClick}
    >
      <Card
        style={{
          width: '280px',
          height: '400px',
          overflow: 'hidden',
        }}
        bodyStyle={{
          padding: '12px',
          height: '30%',
          display: 'flex',
          flexDirection: 'column',
        }}
        cover={
          <div style={{ height: '70%' }}>
            <img
              alt="poster"
              src={mangaDetail.posterUrl}
              style={{
                width: '100%',
                height: '280px',
                objectFit: 'cover',
              }}
            />
          </div>
        }
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1 line-clamp-2">
              {mangaDetail.title}
            </h3>

            <div className="mb-2 flex flex-wrap">
              {mangaDetail.genres &&
                mangaDetail.genres.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-blue-50 text-blue-600 rounded-full px-2 py-0.5 mr-1 mb-1"
                  >
                    {tag}
                  </span>
                ))}
              {mangaDetail.genres && mangaDetail.genres.length > 2 && (
                <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 mr-1 mb-1">
                  +{mangaDetail.genres.length - 2}
                </span>
              )}
            </div>
          </div>

          <div className="mt-auto">
            <p className="text-sm text-gray-600 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {mangaDetail.author || 'Unknown author'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NewestCard;