// 📁 src/components/MangaDetail/MangaBanner.tsx
import React from 'react';
import { PlayCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

interface MangaBannerProps {
  id: number;
  title: string;
  poster: string;
  background: string;
  author: string;
  numberOfChapters: number;
}

const MangaBanner: React.FC<MangaBannerProps> = ({ id, title, poster, background, author, numberOfChapters}) => {
  return (
    <div
      className="relative w-full h-[500px] bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60" />
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="max-w-7xl mx-auto flex items-end space-x-8">
          <div className="w-48 h-72 bg-white p-2 shadow-lg">
            <img 
              src={poster} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-white">
            <h1 className="text-6xl font-bold mb-2">{title}</h1>
            <p className="text-lg text-gray-300 mb-4">{author}</p>
            {numberOfChapters >= 1 ? (
            <Link to={`/manga/${id}/chapter/1`}>
              <button className="flex items-center bg-purple-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-purple-700 transition-colors">
                <PlayCircleOutlined className="mr-2" />
                ĐỌC TỪ CHƯƠNG 1
              </button>
            </Link>
          ) : (
            <button
              disabled
              className="flex items-center bg-gray-400 text-white px-6 py-3 rounded-md font-semibold cursor-not-allowed"
            >
              <PlayCircleOutlined className="mr-2" />
              ĐỌC TỪ CHƯƠNG 1
            </button>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaBanner;