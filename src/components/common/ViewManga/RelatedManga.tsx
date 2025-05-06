// 📁 src/components/MangaDetail/RelatedManga.tsx
import React, { useEffect, useState } from 'react';

interface RelatedMangaItem {
  id: number;
  title: string;
  posterUrl: string;
  readTimes: number;
  date: string;
}

interface RelatedMangaProps {
  currentMangaId: number;
}

const RelatedManga: React.FC<RelatedMangaProps> = ({ currentMangaId }) => {
  const [relatedManga, setRelatedManga] = useState<RelatedMangaItem[]>([]);

  useEffect(() => {
    const fetchRelatedManga = async () => {
      try {
        // Mock data - replace with actual API call
        const mockData: RelatedMangaItem[] = [
          {
            id: 1,
            title: 'Hell dogs (Hoan thanh)',
            posterUrl: '/api/placeholder/80/120',
            readTimes: 124,
            date: '5 ngày trước'
          },
          {
            id: 2,
            title: 'Bumigou',
            posterUrl: '/api/placeholder/80/120',
            readTimes: 190,
            date: '3 ngày trước'
          },
          {
            id: 3,
            title: 'The Fable - Bí mật thứ ba',
            posterUrl: '/api/placeholder/80/120',
            readTimes: 167,
            date: '2 ngày trước'
          },
          // Add more mock data as needed
        ];
        setRelatedManga(mockData);
      } catch (error) {
        console.error('Error fetching related manga:', error);
      }
    };

    fetchRelatedManga();
  }, [currentMangaId]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-4">CÙNG NHÓM DỊCH</h3>
      <div className="space-y-4">
        {relatedManga.map((manga) => (
          <div 
            key={manga.id}
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
          >
            <img 
              src={manga.posterUrl} 
              alt={manga.title}
              className="w-12 h-18 object-cover rounded"
            />
            <div className="flex-1">
              <h4 className="font-medium text-sm">{manga.title}</h4>
              <p className="text-xs text-gray-500">C. {manga.readTimes} - {manga.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedManga;