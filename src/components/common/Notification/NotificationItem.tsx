import React from 'react';
import { List, Typography, Badge, Space } from 'antd';
import { CheckOutlined, BellOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import * as notificationServices from '../../../libs/notificationServices';
// Initialize dayjs plugins
dayjs.extend(relativeTime);

interface NotificationItemProps {
  notification: notificationServices.Notification;
  onMarkAsRead: (id: number) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead }) => {
  // Get the correct icon based on notification type
  const getIcon = () => {
    switch (notification.type.toUpperCase()) {
      case 'WARNING':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'INFO':
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
      default:
        return <BellOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  // Format relative time (e.g., "2 hours ago")
  const formatTime = (dateStr: string): string => {
    return dayjs(dateStr).fromNow();
  };

  return (
    <List.Item 
      className={`px-4 py-3 ${notification.isRead ? 'bg-gray-50' : 'bg-blue-50'} border-b border-gray-100 hover:bg-gray-100`}
      onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
    >
      <div className="flex w-full">
        <div className="mr-3 mt-1">
          <Badge dot={!notification.isRead} color="blue">
            {getIcon()}
          </Badge>
        </div>
        
        <div className="flex-grow">
          <Space direction="vertical" size={1} style={{ width: '100%' }}>
            <Typography.Text 
              strong={!notification.isRead}
              style={{ fontSize: '14px' }}
            >
              {notification.message}
            </Typography.Text>
            
            <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
              {formatTime(notification.createdAt)}
            </Typography.Text>
          </Space>
        </div>
        
        {!notification.isRead && (
          <div 
            className="ml-2 flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
          >
            <CheckOutlined style={{ color: '#8c8c8c', fontSize: '14px' }} />
          </div>
        )}
      </div>
    </List.Item>
  );
};

export default NotificationItem;