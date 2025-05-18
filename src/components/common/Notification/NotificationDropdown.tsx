import React, { useState } from 'react';
import { Badge, Button, Popover } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import NotificationList from './NotificationList';
import { useNotifications } from '../../../context/NotificationContext';

const NotificationDropdown: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { unreadCount, refreshNotifications } = useNotifications();

  const handleVisibleChange = (newVisible: boolean) => {
    setVisible(newVisible);

    if (newVisible) {
      setLoading(true);
      refreshNotifications()
        .finally(() => setLoading(false));
    }
  };

  return (
    <Popover
      placement="bottomRight"
      trigger="click"
      open={visible}
      onOpenChange={handleVisibleChange}
      overlayClassName="notification-popover"
      content={
        <div className="w-80 max-h-96 overflow-y-auto">
          <NotificationList loading={loading} />
        </div>
      }
    >
      <Badge count={unreadCount} overflowCount={99}>
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: '20px' }} />}
          className="px-4 flex items-center justify-center h-10 w-10"
        />
      </Badge>
    </Popover>
  );
};

export default NotificationDropdown;