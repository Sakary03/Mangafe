import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { List, Tag, Spin, Empty, Badge } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import * as historyService from '../../../libs/historyService';
import { getCurrentUser } from '../../../libs/userService';

interface Chapter {
  id: number;
  number: number;
  title: string;
  createdAt: string;
  mangaId?: number;
}

interface ChapterListProps {
  mangaId: number;
  chapters: Chapter[];
}

const ChapterList: React.FC<ChapterListProps> = ({ mangaId, chapters }) => {
  const [readChapters, setReadChapters] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const currentUser = getCurrentUser();

  // Fetch reading history to mark read chapters
  useEffect(() => {
    const fetchReadingHistory = async () => {
      if (!currentUser || !currentUser.id) return;

      setLoading(true);
      try {
        // Get reading history for this manga
        const history = await historyService.getMangaReadingHistory(
          currentUser.id,
          mangaId,
        );

        // Extract chapter IDs from history
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

  if (loading) {
    return (
      <div className="flex justify-center my-4">
        <Spin />
      </div>
    );
  }

  if (!chapters || chapters.length === 0) {
    return <Empty description="No chapters available" />;
  }

  return (
    <List
      className="chapter-list"
      itemLayout="horizontal"
      dataSource={chapters}
      renderItem={chapter => {
        // Check if this chapter has been read
        const isRead = readChapters.includes(chapter.id);

        return (
          <List.Item
            className={`transition-colors ${isRead ? 'bg-gray-50' : ''}`}
            actions={[
              isRead && (
                <Tag color="success" icon={<CheckCircleFilled />}>
                  Read
                </Tag>
              ),
            ].filter(Boolean)}
          >
            <List.Item.Meta
              title={
                <Link to={`/manga/${mangaId}/chapter/${chapter.number}`}>
                  {isRead ? (
                    <Badge
                      status="success"
                      text={`Chapter ${chapter.number}: ${chapter.title}`}
                    />
                  ) : (
                    `Chapter ${chapter.number}: ${chapter.title}`
                  )}
                </Link>
              }
              description={
                <div className="text-xs text-gray-500">
                  {new Date(chapter.createdAt).toLocaleDateString()}
                </div>
              }
            />
          </List.Item>
        );
      }}
    />
  );
};

export default ChapterList;
