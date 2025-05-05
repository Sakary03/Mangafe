import React from 'react';
import { Card } from 'antd';
import { Manga } from './mockInterface';

interface HotStoryCardProps {
  story: Manga;
}

const HotStoryCard: React.FC<HotStoryCardProps> = ({ story }) => {
  return (
    <Card
      hoverable
      cover={<img alt={story.title} src={story.posterUrl} className="aspect-[3/4] object-cover" />}
      className="bg-blue-500 border-0"
    >
      <Card.Meta
        title={<span className="text-white text-sm line-clamp-2">{story.title}</span>}
        description={
          <div className="text-blue-200">
            <div className="text-xs">{story.overview}</div>
            <div className="text-xs mt-1">{story.chapters.length}</div>
          </div>
        }
      />
    </Card>
  );
};

export default HotStoryCard;