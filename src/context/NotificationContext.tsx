/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {notificationServices, Notification, NotificationCount} from '../libs/notificationServices';
import { websocketService } from '../libs/websocketServices';

interface NotificationContextProps {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        console.log('Checking User ID from localStorage:', user.userID);
        setUserId(user.userID);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      refreshNotifications();
      
      websocketService.connect(userId);

      // Subscribe to new notifications
      websocketService.onNotification((newNotification) => {
        setNotifications(prev => [newNotification, ...prev]);
        if (!newNotification.isRead) {
          setUnreadCount(prev => prev + 1);
        }
      });

      // Cleanup on unmount
      return () => {
        websocketService.disconnect();
      };
    }
  }, [userId]);

  const refreshNotifications = async (): Promise<void> => {
    if (userId) {
      try {
        const [notifs, count] = await Promise.all([
          notificationServices.getAllNotifications(userId),
          notificationServices.getUnreadNotificationCount(userId)
        ]);
        setNotifications(notifs);
        setUnreadCount(count);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }
  };

  const markAsRead = async (id: number): Promise<void> => {
    try {
      const success = await notificationServices.markAsRead(id);
      if (success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === id ? { ...notif, isRead: true } : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async (): Promise<void> => {
    if (userId) {
      try {
        const success = await notificationServices.markAllAsRead(userId);
        if (success) {
          setNotifications(prev => 
            prev.map(notif => ({ ...notif, isRead: true }))
          );
          setUnreadCount(0);
        }
      } catch (error) {
        console.error('Error marking all notifications as read:', error);
      }
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        refreshNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextProps => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};