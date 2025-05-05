import CarouselSlider from "./CarouselSlider";
import NewestComponent from "./NewestList.tsx/NewestComponent";

const HomePage: React.FC = () => {
  return (
    <div> 
      <CarouselSlider />
      <NewestComponent />
    </div>
  );
};

export default HomePage;