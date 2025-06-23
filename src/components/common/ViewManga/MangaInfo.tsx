// 📁 src/components/MangaDetail/MangaInfo.tsx
import React, { useEffect } from 'react';

interface MangaInfoProps {
  overview: string;
  description: string;
}

const MangaInfo: React.FC<MangaInfoProps> = ({ overview, description }) => {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .manga-info-box {
        animation: float 3s ease-in-out infinite alternate;
      }
      @keyframes float {
        from { transform: translateY(0); }
        to { transform: translateY(-10px); }
      }
      @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Rubik:wght@400;700&display=swap');
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="manga-info-box bg-white p-8 rounded-lg shadow-xl mb-8 border-2 border-indigo-200">
      <h2
        className="text-3xl font-bold mb-6"
        style={{ fontFamily: "'Bangers', cursive" }}
      >
        TRANG CHÍNH THỨC
      </h2>
      <p
        className="text-gray-800 text-xl mb-8"
        style={{ fontFamily: "'Rubik', sans-serif", fontWeight: 500 }}
      >
        {overview}
      </p>
      <p
        className="text-gray-700 whitespace-pre-wrap text-lg"
        style={{ fontFamily: "'Rubik', sans-serif" }}
      >
        {description}
      </p>
    </div>
  );
};

export default MangaInfo;