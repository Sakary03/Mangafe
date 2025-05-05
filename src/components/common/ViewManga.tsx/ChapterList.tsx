// 📁 src/components/MangaDetail/ChapterList.tsx
import React from 'react';
import { Chapter } from '../../pages/MangaDetailPage';

interface ChapterListProps {
  chapters: Chapter[];
  mangaId: number;
}

const ChapterList: React.FC<ChapterListProps> = ({ chapters, mangaId }) => {
  const handleChapterClick = (chapterId: number) => {
    // Navigate to chapter reader
    window.location.href = `/manga/${mangaId}/chapter/${chapterId}`;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {chapters.map((chapter) => (
        <div 
          key={chapter.id}
          onClick={() => handleChapterClick(chapter.id)}
          className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
        >
          <div className="flex-1">
            <h3 className="font-medium text-lg">Chương {chapter.chapterIndex}</h3>
            <p className="text-sm text-gray-500">{chapter.title}</p>
          </div>
          <div className="text-right text-sm text-gray-500">
            <p>{chapter.readTimes} lượt xem</p>
            <p>{new Date(chapter.createdAt).toLocaleDateString('vi-VN')}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChapterList;