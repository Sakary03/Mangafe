// notificationServices.ts
import api from './api';
import * as mangaServices from './mangaServices';
import * as moment from 'moment';
import * as momentValidate from '../util/momentValidate';
export interface Notification {
  id: number;
  message: string;
  userId: number;
  type: string;
  createdAt: string;
  read: boolean;
}

export interface NotificationCount {
  count: number;
}

const LIST_NOTIFICATIONS_TEMPLATE = {
  newUserFollowManga: async (mangaId: number) => {
    const managa = await mangaServices.getMangaById(mangaId);
    const thisMoment = await momentValidate.getCurrentTimeInHours();
    return `Bạn đã theo dõi Manga ${managa.title} vào lúc ${thisMoment}`;
  },
  unfollowManga: async (mangaId: number) => {
    const managa = await mangaServices.getMangaById(mangaId);
    const thisMoment = await momentValidate.getCurrentTimeInHours();
    return `Bạn đã bỏ theo dõi Manga ${managa.title} vào lúc ${thisMoment}`;
  },
  statusChange: (mangaTitle: string, oldStatus: string, newStatus: string) => {
    const getStatusDisplayName = (status: string) => {
      switch (status.toUpperCase()) {
        case 'APPROVED':
          return 'Approved';
        case 'PENDING':
          return 'Pending Review';
        case 'REJECTED':
          return 'Rejected';
        case 'HIDDEN':
          return 'Hidden';
        case 'DELETED':
          return 'Deleted';
        case 'UPDATE':
          return 'Update Required';
        default:
          return status;
      }
    };

    switch (newStatus.toUpperCase()) {
      case 'APPROVED':
        return `🎉 Tin vui! Manga của bạn "${mangaTitle}" đã được duyệt và hiện đang hiển thị!`;
      case 'REJECTED':
        return `❌ Manga của bạn "${mangaTitle}" đã bị từ chối. Vui lòng xem lại các hướng dẫn và thử lại.`;
      case 'HIDDEN':
        return `👁️ Manga của bạn "${mangaTitle}" đã bị ẩn khỏi chế độ công khai.`;
      case 'UPDATE':
        return `📝 Manga của bạn "${mangaTitle}" cần được cập nhật. Vui lòng kiểm tra và chỉnh sửa lại.`;
      default:
        return `📋 Trạng thái của manga "${mangaTitle}" đã được thay đổi từ ${getStatusDisplayName(
          oldStatus,
        )} sang ${getStatusDisplayName(newStatus)}.`;
    }
  },
};

const BASE_URL = '/notifications';

export const notificationServices = {
  getAllNotifications: async (userId: number): Promise<Notification[]> => {
    const response = await api.get(`${BASE_URL}/user/${userId}`);
    console.log('Checking Response from getAllNotifications:', response.data);
    return response.data;
  },

  getUnreadNotifications: async (userId: number): Promise<Notification[]> => {
    const response = await api.get(`${BASE_URL}/user/${userId}/unread`);
    return response.data;
  },

  getUnreadNotificationCount: async (
    userId: number,
  ): Promise<NotificationCount> => {
    const response = await api.get(`${BASE_URL}/user/${userId}/count`);
    console.log(
      'Checking Response from getUnreadNotificationCount:',
      response.data,
    );
    return response.data;
  },

  markAsRead: async (notificationId: number): Promise<boolean> => {
    const response = await api.put(`${BASE_URL}/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async (userId: number): Promise<boolean> => {
    const response = await api.put(`${BASE_URL}/user/${userId}/read-all`);
    return response.data;
  },

  newFollowNotification: async (
    userId: number,
    mangaId: number,
  ): Promise<Notification> => {
    const message = await LIST_NOTIFICATIONS_TEMPLATE.newUserFollowManga(
      mangaId,
    );
    console.log('Checking message:', message);
    const response = await api.post(`${BASE_URL}`, {
      userId,
      message,
      type: 'newUserFollowManga',
    });
    return response.data;
  },

  unfollowNotification: async (
    userId: number,
    mangaId: number,
  ): Promise<Notification> => {
    const message = await LIST_NOTIFICATIONS_TEMPLATE.unfollowManga(mangaId);
    console.log('Checking message:', message);
    const response = await api.post(`${BASE_URL}`, {
      userId,
      message,
      type: 'unfollowManga',
    });
    return response.data;
  },

  statusChangeNotification: async (
    userId: number,
    mangaTitle: string,
    oldStatus: string,
    newStatus: string,
  ): Promise<Notification> => {
    const message = LIST_NOTIFICATIONS_TEMPLATE.statusChange(
      mangaTitle,
      oldStatus,
      newStatus,
    );
    console.log('Checking status change message:', message);
    const response = await api.post(`${BASE_URL}`, {
      userId,
      message,
      type: 'statusChange',
    });
    return response.data;
  },
};
