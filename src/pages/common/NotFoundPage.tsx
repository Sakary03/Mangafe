import { Layout, Result } from 'antd';
import { Content } from 'antd/es/layout/layout';
const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <Content>
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          icon={<Result.PRESENTED_IMAGE_404 />}
        />
      </Content>
    </Layout>
  );
};
export default NotFoundPage;
