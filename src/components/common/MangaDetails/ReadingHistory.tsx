import React from 'react';
import { Typography, Divider, Card } from 'antd';
import ChapterList from '../ChapterList/ChapterList';
import ReadingProgress from './ReadingProgress';

const { Title } = Typography;

interface ReadingHistoryProps {
  mangaId: number;
  chapters: {
    id: number;
    number: number;
    title: string;
    createdAt: string;
    mangaId?: number;
  }[];
}

const ReadingHistory: React.FC<ReadingHistoryProps> = ({
  mangaId,
  chapters,
}) => {
  return (
    <div className="reading-history">
      <ReadingProgress mangaId={mangaId} chapterCount={chapters.length} />

      <Card>
        <Title level={4}>Chapters</Title>
        <Divider />
        <ChapterList mangaId={mangaId} chapters={chapters} />
      </Card>
    </div>
  );
};

export default ReadingHistory;
