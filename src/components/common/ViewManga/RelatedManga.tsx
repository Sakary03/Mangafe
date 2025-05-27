// 📁 src/components/MangaDetail/RelatedManga.tsx
import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import * as mangaService from '../../../libs/mangaServices';
import { useNavigate } from 'react-router-dom';

interface RelatedMangaProps {
  currentMangaId: number;
}

const RelatedManga: React.FC<RelatedMangaProps> = ({ currentMangaId }) => {
  const [relatedManga, setRelatedManga] = useState<mangaService.MangaItem[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelatedManga = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get recommendations with updated format
        const recommendations = await mangaService.recommendManga(
          [currentMangaId],
          5,
        );

        if (recommendations && Array.isArray(recommendations)) {
          // Extract IDs from the recommendations array
          const recommendedIds = recommendations.map(item => Number(item.id));

          // Fetch full details for each manga
          const mangaDetailsPromises = recommendedIds.map(id =>
            mangaService.getMangaById(id),
          );

          const mangaDetails = await Promise.all(mangaDetailsPromises);
          setRelatedManga(mangaDetails);
        } else {
          setRelatedManga([]);
        }
      } catch (error) {
        console.error('Error fetching related manga:', error);
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    if (currentMangaId) {
      fetchRelatedManga();
    }
  }, [currentMangaId]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-4">MANGA TƯƠNG TỰ</h3>

      {loading ? (
        <div className="flex justify-center py-4">
          <Spin size="small" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">
          <p>{error}</p>
        </div>
      ) : relatedManga.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          <p>Không có manga tương tự</p>
        </div>
      ) : (
        <div className="space-y-4">
          {relatedManga.map(manga => (
            <div
              key={manga.id}
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
              onClick={() => {
                navigate(`/manga/${manga.id}`);
                window.location.reload();
              }}
            >
              <img
                src={manga.posterUrl}
                alt={manga.title}
                className="w-14 h-20 object-cover rounded shadow-sm"
              />
              <div className="flex-1">
                <h4 className="font-medium text-sm line-clamp-2">
                  {manga.title}
                </h4>
                <div className="flex flex-wrap mt-1">
                  {manga.genres &&
                    manga.genres.slice(0, 2).map((genre, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-blue-50 text-blue-600 rounded-full px-2 py-0.5 mr-1 mb-1"
                      >
                        {genre}
                      </span>
                    ))}
                  {manga.genres && manga.genres.length > 2 && (
                    <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-1.5 py-0.5 mb-1">
                      +{manga.genres.length - 2}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {manga.readTimes
                    ? `${manga.readTimes} lượt xem`
                    : 'Mới cập nhật'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedManga;