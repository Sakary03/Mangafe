import React, { useState } from 'react';
import { Tabs } from 'antd';
import RankingItem from './RankingItem';
import { mockData } from './mockData';
const TopRankings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('1');

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">NHÓM DỊCH HÀNG DẦU</h2>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="mb-4"
      />
      <div className="bg-white rounded-lg overflow-hidden">
        {mockData.map((story) => (
          <RankingItem story={story} />
        ))}
      </div>
    </div>
  );
};

export default TopRankings;