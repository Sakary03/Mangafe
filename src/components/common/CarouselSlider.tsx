/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Carousel, Tag } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import * as mangaServices from '../../libs/mangaServices';
import { Link } from 'react-router-dom';
interface SlideItem {
  id: string;
  background: string;
  name: string;
  overview: string;
  tags: string[];
}

interface CarouselSliderProps {
  autoplay?: boolean;
  slidesPerView?: number;
  speed?: number;
}

const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.5),
    rgba(0, 0, 0, 0.7)
  );
  padding: 0;
`;

const SlideContent = styled.div<{ background: string }>`
  position: relative;
  height: 600px;
  width: 80%;
  margin: 0 auto;
  background-image: url(${props => props.background});
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
  color: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
  }
`;

const SlideInfo = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  padding: 16px;
  max-width: 100%;
  border-radius: 12px;
  backdrop-filter: blur(5px);
  transform: translateY(5px);
  transition: transform 0.3s ease;

  ${SlideContent}:hover & {
    transform: translateY(0);
  }
`;

const SlideName = styled.h2`
  font-size: 24px;
  margin-bottom: 12px;
`;

const SlideOverview = styled.p`
  font-size: 16px;
  margin-bottom: 16px;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const CustomTag = styled(Tag)`
  border-radius: 20px;
  padding: 4px 12px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const CustomArrow = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  width: 50px;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
    transform: translateY(-50%) scale(1.1);
  }
`;

// Add these new styled components
const CarouselContainer = styled.div`
  position: relative;
  overflow: hidden;
  padding: 20px 0;

  .slick-slide {
    transition: all 0.5s ease;
    filter: blur(1px) brightness(0.5);
    opacity: 0.3;
    transform: scale(0.9);
  }

  .slick-center {
    filter: blur(0) brightness(1);
    opacity: 1;
    transform: scale(1);
  }

  .slick-list {
    overflow: visible;
    padding: 30px 0;
  }
`;

const InfoButton = styled.button`
  background-color: #3b4bca;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 25px;
  margin-top: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #2a3499;
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const LeftArrow = styled(CustomArrow)`
  left: 5%;
`;

const RightArrow = styled(CustomArrow)`
  right: 5%;
`;

const fetchSlideData = async (): Promise<SlideItem[]> => {
  const response = await mangaServices.getAllManga(0, 10, 'title', true);
  const listManga = response
    .filter((item: any) => item.backgroundUrl !== null)
    .map((item: any) => ({
      id: item.id,
      background: item.backgroundUrl,
      name: item.title,
      overview: item.overview,
      tags: item.genres,
    }));
  console.log('listManga', listManga);
  return listManga;
};

const CarouselSlider: React.FC<CarouselSliderProps> = ({
  autoplay = true,
  slidesPerView = 1,
  speed = 500,
}) => {
  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const carouselRef = React.useRef<any>(null);

  useEffect(() => {
    const getSlides = async () => {
      try {
        setLoading(true);
        const data = await fetchSlideData();
        setSlides(data);
      } catch (error) {
        console.error('Error fetching slides:', error);
      } finally {
        setLoading(false);
      }
    };

    getSlides();
  }, []);

  const handlePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.prev();
    }
  };

  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  // Carousel settings
  const settings = {
    dots: false,
    infinite: true,
    speed: speed,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: autoplay,
    autoplaySpeed: 4000,
    centerMode: true,
    centerPadding: '13%',
    beforeChange: (current: number, next: number) => {},
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  const handleCount = async (id: number) => {
    return await mangaServices.handleViewManga(id);
  };
  return (
    <CarouselWrapper className="">
      <div className="h-20" />
      <CarouselContainer>
        <LeftArrow onClick={handlePrev}>
          <LeftOutlined />
        </LeftArrow>

        <Carousel ref={carouselRef} {...settings}>
          {slides.map(slide => (
            <div key={slide.id}>
              <SlideContent background={slide.background}>
                <SlideInfo>
                  <SlideName>{slide.name}</SlideName>
                  <SlideOverview>{slide.overview}</SlideOverview>
                  <TagsContainer>
                    {slide.tags.map((tag, index) => (
                      <CustomTag key={index} color="blue">
                        {tag}
                      </CustomTag>
                    ))}
                  </TagsContainer>
                  <Link to={`/manga/${slide.id}`}>
                    <InfoButton onClick={() => handleCount(Number(slide.id))}>
                      XEM THÔNG TIN
                    </InfoButton>
                  </Link>
                </SlideInfo>
              </SlideContent>
            </div>
          ))}
        </Carousel>

        <RightArrow onClick={handleNext}>
          <RightOutlined />
        </RightArrow>
      </CarouselContainer>
    </CarouselWrapper>
  );
};

export default CarouselSlider;