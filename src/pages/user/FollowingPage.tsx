import React from 'react';
import { Layout } from 'antd';
import Following from '../../components/user/Following';
const { Content } = Layout;

const FollowingPage: React.FC = () => {
  return (
    <Layout className="min-h-screen">
      <Content className="mt-16">
        <Following />
      </Content>
    </Layout>
  );
};

export default FollowingPage;
