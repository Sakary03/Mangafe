import React from 'react';
import { Card } from 'antd';
import { Manga } from './mockInterface';

interface StoryCardProps {
  story: Manga;
}

const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  return (
    <Card
      hoverable
      cover={<img alt={story.title} src={story.posterUrl} className="aspect-[3/4] object-cover" />}
      className="h-full"
    >
      <Card.Meta
        title={<span className="text-sm line-clamp-2 h-10">{story.title}</span>}
        description={<span className="text-red-600">{story.chapters.length}</span>}
      />
    </Card>
  );
};

export default StoryCard;