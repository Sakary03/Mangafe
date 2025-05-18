// 📁 src/components/MangaDetail/MangaBanner.tsx
import React, { useEffect, useState } from 'react';
import { PlayCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Button, Flex } from 'antd';
import followService from '../../../libs/followService';
import * as userService from '../../../libs/userService';
interface MangaBannerProps {
  id: number;
  title: string;
  poster: string;
  background: string;
  author: string;
  numberOfChapters: number;
  isLoggedIn: boolean;
}

const MangaBanner: React.FC<MangaBannerProps> = ({
  id,
  title,
  poster,
  background,
  author,
  numberOfChapters,
  isLoggedIn,
}) => {
  const [userId, setUserId] = useState<number>(-1);
  const [isFollowing, setIsFollowing] = useState<boolean | undefined>(
    undefined,
  );

  useEffect(() => {
    const fetchUserId = async () => {
      const currentUser = await userService.getCurrentUser();
      setUserId(currentUser.userID);
    };
    fetchUserId();
  }, []);

  const handleFollowManga = async () => {
    if (!isLoggedIn) {
      return;
    }
    if (!isFollowing) {
      followService.userFollowNewManga(userId, id);
      setIsFollowing(true);
    } else {
      followService.unfollowManga(userId, id);
      setIsFollowing(false);
    }
    return true;
  };
  useEffect(() => {
    const fetchIsFollowing = async () => {
      const result = await followService.isFollowingManga(userId, id);
      setIsFollowing(result);
    };
    fetchIsFollowing();
  }, [isFollowing]);
  return (
    <div
      className="relative w-full h-[500px] bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60" />
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="max-w-7xl mx-auto flex items-end space-x-8">
          <div className="w-48 h-72 bg-white p-2 shadow-lg">
            <img
              src={poster}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-white">
            <h1 className="text-6xl font-bold mb-2">{title}</h1>
            <p className="text-lg text-gray-300 mb-4">{author}</p>
            <Flex>
              {isLoggedIn ? (
                isFollowing ? (
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    className="flex items-center bg-red-400 hover:bg-red-500 text-white font-semibold"
                    size="large"
                    onClick={handleFollowManga}
                  >
                    BỎ THEO DÕI
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                    size="large"
                    onClick={handleFollowManga}
                  >
                    THEO DÕI TRUYỆN NÀY
                  </Button>
                )
              ) : (
                <Button
                  disabled={true}
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  className="flex items-center text-white font-semibold !bg-gray-400 !border-gray-400 !opacity-100"
                  size="large"
                >
                  ĐĂNG NHẬP ĐỂ THEO DÕI
                </Button>
              )}
              <div className="w-5"></div>
              {numberOfChapters >= 1 ? (
                <Link to={`/manga/${id}/chapter/1`}>
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    className="flex items-center bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                    size="large"
                  >
                    ĐỌC TỪ CHƯƠNG 1
                  </Button>
                </Link>
              ) : (
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  className="flex items-center text-white font-semibold !bg-gray-400 !border-gray-400 !opacity-100"
                  size="large"
                  disabled
                >
                  ĐỌC TỪ CHƯƠNG 1
                </Button>
              )}
            </Flex>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaBanner;