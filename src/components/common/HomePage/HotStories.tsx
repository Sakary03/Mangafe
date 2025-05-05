import React, { useState } from 'react';
import { Row, Col, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { mockData } from './mockData'
import HotStoryCard from './HotStoryCard';

const HotStories: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('1');

  return (
    <div className="bg-blue-600 py-8">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">TRUYỆN NỔI BẬT</h2>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="custom-tabs"
        />
        <Row gutter={[16, 16]} className="mt-4">
          {mockData.map((story) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={4} key={story.id}>
              <HotStoryCard story={story} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default HotStories;