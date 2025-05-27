import CarouselSlider from "./CarouselSlider";
import GetByGenres from './GetByGenres';
import MostViews from './MostViews.tsx/MostViews';
import NewestComponent from "./NewestList.tsx/NewestComponent";

const HomePage: React.FC = () => {
  return (
    <div>
      <CarouselSlider />
      <NewestComponent />
      <MostViews />
      <GetByGenres />
    </div>
  );
};

export default HomePage;