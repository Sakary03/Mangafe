import React, { useState, useEffect } from 'react';
import { Typography, Progress, Card, Statistic } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import * as historyService from '../../../libs/historyService';
import { getCurrentUser } from '../../../libs/userService';

const { Title } = Typography;

interface ReadingProgressProps {
  mangaId: number;
  chapterCount: number;
}

const ReadingProgress: React.FC<ReadingProgressProps> = ({
  mangaId,
  chapterCount,
}) => {
  const [readChapters, setReadChapters] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const fetchReadingProgress = async () => {
      if (!currentUser || !currentUser.id || chapterCount === 0) return;

      setLoading(true);
      try {
        // Get reading history for this manga
        const history = await historyService.getMangaReadingHistory(
          currentUser.id,
          mangaId,
        );

        // Extract unique chapter IDs (in case there are duplicates)
        const uniqueChapterIds = [
          ...new Set(history.map(item => item.chapter.id)),
        ];
        setReadChapters(uniqueChapterIds);
      } catch (error) {
        console.error('Error fetching reading history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReadingProgress();
  }, [mangaId, currentUser, chapterCount]);

  // Calculate reading progress percentage
  const readCount = readChapters.length;
  const progressPercent =
    chapterCount > 0 ? Math.round((readCount / chapterCount) * 100) : 0;

  return (
    <Card
      title={<Title level={5}>Your Reading Progress</Title>}
      loading={loading}
      className="mb-4"
    >
      <div className="flex items-center mb-4">
        <Statistic
          title="Chapters Read"
          value={readCount}
          suffix={`/ ${chapterCount}`}
          prefix={<BookOutlined />}
        />
      </div>
      <Progress
        percent={progressPercent}
        status="active"
        strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068',
        }}
      />
      {currentUser ? (
        <div className="text-sm text-gray-500 mt-2">
          {progressPercent === 100
            ? "Congratulations! You've read all chapters."
            : `You've read ${progressPercent}% of this manga.`}
        </div>
      ) : (
        <div className="text-sm text-gray-500 mt-2">
          Log in to track your reading progress.
        </div>
      )}
    </Card>
  );
};

export default ReadingProgress;
