// 📁 src/components/MangaDetail/MangaInfo.tsx
import React from 'react';

interface MangaInfoProps {
  overview: string;
  description: string;
}

const MangaInfo: React.FC<MangaInfoProps> = ({ overview, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h2 className="text-xl font-bold mb-4">TRANG CHÍNH THỨC</h2>
      <p className="text-gray-700 mb-6">{overview}</p>
      <p className="text-gray-600 whitespace-pre-wrap">{description}</p>
    </div>
  );
};

export default MangaInfo;