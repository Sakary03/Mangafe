import { Layout } from 'antd';
import LatestStories from './LatestStories';
import HotStories from './HotStories';
import TopRankings from './TopRankings';
const { Content } = Layout;

const Home: React.FC = () => {
    return (        
        <div>
          <Content className="overflow-hidden">
            <LatestStories />
            <HotStories />
            <TopRankings />
          </Content>
        </div>  
      );
};

export default Home;