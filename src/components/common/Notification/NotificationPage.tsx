import React, { useState, useEffect } from 'react';
import { Card, Tabs, Badge, Skeleton } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import NotificationList from './NotificationList';
import { NotificationProvider, useNotifications } from '../../../context/NotificationContext';
import { notificationServices } from '../../../libs/notificationServices';
import { Notification } from '../../../libs/notificationServices';

const { TabPane } = Tabs;

const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);
  const { notifications, refreshNotifications, unreadCount } = useNotifications();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Get user ID from localStorage
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setUserId(user.id);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId]);

  const loadData = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      await refreshNotifications();
      const unread = await notificationServices.getUnreadNotifications(userId);
      setUnreadNotifications(unread);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = async (key: string) => {
    setActiveTab(key);
    if (key === 'unread' && userId) {
      setLoading(true);
      try {
        const unread = await notificationServices.getUnreadNotifications(userId);
        setUnreadNotifications(unread);
      } catch (error) {
        console.error('Error fetching unread notifications:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <NotificationProvider>
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-md">
        <div className="flex items-center mb-6">
          <BellOutlined className="text-2xl mr-3 text-blue-500" />
          <h1 className="text-2xl font-semibold m-0">Notifications</h1>
        </div>

        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane
            tab={
              <span>All Notifications</span>
            }
            key="all"
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
              <NotificationList />
            )}
          </TabPane>
          <TabPane
            tab={
              <span className="flex items-center">
                Unread
                <Badge count={unreadCount} className="ml-2" />
              </span>
            }
            key="unread"
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 3 }} />
            ) : (
              <div className="notification-list">
                {unreadNotifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No unread notifications
                  </div>
                ) : (
                  <NotificationList />
                )}
              </div>
            )}
          </TabPane>
        </Tabs>
      </Card>
    </div>
    </NotificationProvider>
  );
};

export default NotificationsPage;