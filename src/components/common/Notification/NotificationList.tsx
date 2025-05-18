import React from 'react';
import { List, Typography, Badge, Empty, Button, Spin } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import { Notification } from '../../../libs/notificationServices';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { useNotifications } from '../../../context/NotificationContext';

const { Text, Title } = Typography;

interface NotificationListProps {
  loading?: boolean;
}

const NotificationList: React.FC<NotificationListProps> = ({
  loading = false,
}) => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  const handleMarkAsRead = async (id: number) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'message':
        return <i className="fas fa-envelope text-blue-500" />;
      case 'like':
        return <i className="fas fa-heart text-red-500" />;
      case 'comment':
        return <i className="fas fa-comment text-green-500" />;
      case 'follow':
        return <i className="fas fa-user-plus text-purple-500" />;
      default:
        return <BellOutlined className="text-gray-500" />;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Unknown time';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="notification-list">
      <div className="flex justify-between items-center mb-4">
        <Title level={4} className="m-0">
          Notifications
        </Title>
        {notifications.length > 0 && (
          <Button
            type="text"
            icon={<CheckOutlined />}
            onClick={handleMarkAllAsRead}
            className="text-blue-500 hover:text-blue-700"
          >
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Empty description="No notifications yet" />
      ) : (
        <List
          dataSource={notifications}
          renderItem={(notification: Notification) => (
            <List.Item
              key={notification.id}
              className={`rounded-lg mb-2 p-4 ${
                !notification.read ? 'bg-blue-50' : 'bg-white'
              }`}
              onClick={() =>
                !notification.read && handleMarkAsRead(notification.id)
              }
            >
              <List.Item.Meta
                avatar={
                  <Badge dot={!notification.read} offset={[-2, 3]}>
                    <span className="text-lg">
                      {getNotificationIcon(notification.type)}
                    </span>
                  </Badge>
                }
                title={
                  <div className="flex justify-between">
                    <Text strong={!notification.read}>
                      {notification.message}
                    </Text>
                    <Text type="secondary" className="text-xs">
                      {formatTime(notification.createdAt)}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default NotificationList;
