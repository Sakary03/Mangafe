import React from 'react';
import { Manga } from './mockInterface';

interface RankingItemProps {
  story: Manga;
}

const RankingItem: React.FC<RankingItemProps> = ({ story }) => {
  return (
    <div className="flex items-center p-4 border-b last:border-b-0 hover:bg-gray-50">
      <div className="w-8 text-center font-bold">{100}</div>
      <div className="flex-1">
        <h3 className="font-semibold">{story.title}</h3>
        <p className="text-sm text-gray-600">{story.chapters.length}</p>
        <p className="text-sm text-gray-500">{1000}</p>
      </div>
    </div>
  );
};

export default RankingItem;
