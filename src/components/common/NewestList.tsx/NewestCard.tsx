import React from 'react';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import * as mangaService from '../../../libs/mangaServices';
const { Meta } = Card;

export interface NewestCardProps {
    id: number;
    title: string;
    backgroundUrl: string;
    posterUrl: string;
    overview: string;
    tags: string[];
    description: string;
}

const NewestCard: React.FC<NewestCardProps> = (mangaDetail) => {
    const navigate = useNavigate();
    const handleCardClick = async () => {
      await mangaService.handleViewManga(mangaDetail.id);
      console.log(`Navigating to manga ${mangaDetail.id}`);
      navigate(`/manga/${mangaDetail.id}`);
    };

    return (
        <div 
            style={{ 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
            }}
            onMouseEnter={(e) => {
                const card = e.currentTarget;
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
                const card = e.currentTarget;
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
            }}
            onClick={handleCardClick}
        >
            <Card
                style={{ 
                    width: '300px',
                }}
                cover={
                    <img
                        alt="poster"
                        src={mangaDetail.posterUrl}
                        style={{
                            width: '300px',
                            height: '300px',
                            objectFit: 'cover'
                        }}
                    />
                }
                actions={[
                    <SettingOutlined key="setting" />,
                    <EditOutlined key="edit" />,
                    <EllipsisOutlined key="ellipsis" />,
                ]}
            >
                <Meta
                    avatar={<Avatar src="https://img.freepik.com/free-vector/business-user-cog_78370-7040.jpg?t=st=1746347983~exp=1746351583~hmac=956926bc34038a77c3c6d9d9823427f8739154276a2eb98b239bac752babaf22&w=740" />}
                    title={mangaDetail.title}
                    description={mangaDetail.overview}
                />
            </Card>
        </div>
    );
};

export default NewestCard;