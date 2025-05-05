import React from 'react';
import { Row, Col, Button } from 'antd';
import { mockData } from './mockData'
import StoryCard from './StoryCard';

const LatestStories: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">MỚI CẬP NHẬT</h2>
      <Row gutter={[16, 16]}>
        {mockData.map((story) => (
          <Col xs={12} sm={8} md={6} lg={4} xl={3} key={story.id}>
            <StoryCard story={story} />
          </Col>
        ))}
      </Row>
      <div className="text-center mt-8">
        <Button type="primary" size="large">
          » Xem thêm truyện truyện
        </Button>
      </div>
    </div>
  );
};

export default LatestStories;