/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api';
import { notificationServices } from './notificationServices';

export interface UserFollow {
  id: number;
  userId: number;
  mangaId: number;
  createdAt: string;
  // Add other fields if necessary based on your backend model
}

export interface MangaFollower {
  userId: number;
  username: string;
  // Add other user fields if necessary
}

export const getUserFollowedManga = async (
  userId: number,
  offset: number = 0,
  limit: number = 10,
) => {
  const response = await api.get(`/follow/user/${userId}`, {
    params: { offset, limit },
  });
  return response.data;
};

export const followManga = async (userId: number, mangaId: number) => {
  console.log('Following manga:', { userId, mangaId });
  const response = await api.post('/follow/create', null, {
    params: { userId, mangaId },
  });
  return response.data;
};

export const getMangaFollowers = async (
  mangaId: number,
  offset: number = 0,
  limit: number = 10,
) => {
  const response = await api.get(`/follow/manga/${mangaId}`, {
    params: { offset, limit },
  });
  return response.data;
};

export const getMangaFollowersCount = async (mangaId: number) => {
  const response = await api.get(`/follow/manga/${mangaId}/count`);
  return response.data;
};

export const getUserFollowCount = async (userId: number) => {
  const response = await api.get(`/follow/user/${userId}/count`);
  return response.data;
};

export const unfollowManga = async (userId: number, mangaId: number) => {
  try {
    const response = await api.delete('/follow/unfollow', {
      params: { userId, mangaId },
    });
    const notificationResponse =
      await notificationServices.unfollowNotification(userId, mangaId);
    console.log('Unfollow notification sent:', notificationResponse);
    return response.data;
  } catch (error) {
    console.error('Error unfollowing manga:', error);
    return null;
  }
};

export const isFollowingManga = async (userId: number, mangaId: number) => {
  try {
    const follows = await getUserFollowedManga(userId);
    return follows.content.some((follow: any) => follow.id === mangaId);
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false;
  }
};

export const userFollowNewManga = async (userId: number, mangaId: number) => {
  try {
    const follow = await followManga(userId, mangaId);
    if (follow) {
      console.log('Followed manga successfully:', follow);
      const response = await notificationServices.newFollowNotification(
        userId,
        mangaId,
      );
      console.log('Notification sent successfully:', response);
    }
    return follow;
  } catch (error) {
    console.error('Error following manga:', error);
    return error;
  }
};

export default {
  getUserFollowedManga,
  followManga,
  getMangaFollowers,
  getMangaFollowersCount,
  getUserFollowCount,
  unfollowManga,
  userFollowNewManga,
  isFollowingManga,
};
