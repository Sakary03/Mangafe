import React, { useState, useEffect } from 'react';
import { Chapter } from '../ViewManga/MangaDetailPage';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../../libs/userService';
import * as historyService from '../../../libs/historyService';
import { Badge } from 'antd';

interface ChapterListProps {
  chapters: Chapter[];
  mangaId: number;
}
const ChapterList: React.FC<ChapterListProps> = ({ chapters, mangaId }) => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [readChapters, setReadChapters] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchReadingHistory = async () => {
      if (!currentUser || !currentUser.userID) return;

      try {
        setLoading(true);
        const history = await historyService.getMangaReadingHistory(
          currentUser.userID,
          mangaId,
        );
        const readChapterIds = history.map(item => item.chapter.id);
        setReadChapters(readChapterIds);
      } catch (error) {
        console.error('Error fetching reading history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReadingHistory();
  }, [mangaId, currentUser]);

  const handleChapterClick = async (chapter: Chapter) => {
    if (currentUser && currentUser.userID) {
      console.log('Checking currentUser', currentUser);
      console.log(
        'Checking parameters',
        mangaId,
        chapter.id,
        currentUser.userID,
      );
      try {
        await historyService.recordChapterRead(
          currentUser.userID,
          mangaId,
          chapter.id,
        );

        if (!readChapters.includes(chapter.id)) {
          setReadChapters(prev => [...prev, chapter.id]);
        }
      } catch (error) {
        console.error('Error recording reading history:', error);
      }
    }

    navigate(`/manga/${mangaId}/chapter/${chapter.chapterIndex}`);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {chapters?.map(chapter => {
        const isRead = readChapters.includes(chapter.id);

        return (
          <div
            key={chapter.id}
            onClick={() => handleChapterClick(chapter)}
            className={`flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer ${
              isRead ? 'bg-gray-50' : ''
            }`}
          >
            <div className="flex-1">
              <h3 className="font-medium text-lg flex items-center">
                {isRead ? (
                  <Badge
                    status="success"
                    text={`Chương ${chapter.chapterIndex}`}
                    className="mr-2"
                  />
                ) : (
                  <>Chương {chapter.chapterIndex}</>
                )}
              </h3>
              <p className="text-sm text-gray-500">{chapter.title}</p>
            </div>
            <div className="text-right text-sm text-gray-500">
              <p>{chapter.readTimes} lượt xem</p>
              <p>{new Date(chapter.createdAt).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChapterList;
