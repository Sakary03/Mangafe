import React, { useEffect, useState } from 'react'
import { RightOutlined } from '@ant-design/icons';
import * as mangaService from '../../../libs/mangaServices';
import NewestCard, { NewestCardProps } from './NewestCard';
import { useNavigate } from 'react-router-dom';

export default function NewestComponent() {
    const [listNewest, setListNewest] = useState<NewestCardProps[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchManga = async () => {
          const data = await mangaService.getAllManga(0, 10, 'createdAt', true);
          setListNewest(data);
        };
        fetchManga();
      }, []);
    
    const filteredManga = listNewest.filter((item) => {
        return item.posterUrl !== null && item.backgroundUrl !== null;
    });

    const handleViewMore = () => {
        // Mock navigation - replace with your actual navigation logic
        console.log('Navigating to all manga page');
        navigate('/')
    };
    
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center">
            <div className="w-full max-w-[80%] px-4 sm:px-6 lg:px-8 py-5">
                {/* Beautiful header */}
                <div className="flex items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 relative">
                        Newest Manga
                        <div className="h-1 w-16 bg-purple-600 mt-2 rounded-full"></div>
                    </h1>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center mb-8">
                    {filteredManga.map((item) => (
                        <NewestCard key={item.id} {...item} />
                    ))}
                </div>
                
                <div className="flex justify-end">
                    <button 
                        onClick={handleViewMore}
                        className="group inline-flex items-center px-6 py-3 text-lg font-medium text-purple-600 hover:text-purple-700 bg-white hover:bg-gray-50 rounded-full border border-purple-200 hover:border-purple-300 transition-all duration-200"
                    >
                        Show More
                        <RightOutlined className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </div>
    )
}