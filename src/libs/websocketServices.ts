import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import * as notificationServices from './notificationServices'

type NotificationCallback = (notification: notificationServices.Notification) => void;

class WebSocketService {
  private client: Client | null = null;
  private callbacks: NotificationCallback[] = [];

  constructor() {
    this.client = null;
  }

  connect(userId: number): void {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:9090/ws'),
      onConnect: () => {
        console.log('WebSocket connected');
        if (this.client) {
          // Subscribe to user-specific notifications
          this.client.subscribe(`/queue/notifications/${userId}`, (message: IMessage) => {
            try {
              const notification: notificationServices.Notification = JSON.parse(message.body);
              this.notifyCallbacks(notification);
            } catch (error) {
              console.error('Error parsing notification:', error);
            }
          });
          
          // Subscribe to broadcast notifications (optional)
          this.client.subscribe('/topic/notifications', (message: IMessage) => {
            try {
              const notification: notificationServices.Notification = JSON.parse(message.body);
              // Only process if this notification is for the current user
              if (notification.userId === userId) {
                this.notifyCallbacks(notification);
              }
            } catch (error) {
              console.error('Error parsing notification:', error);
            }
          });
        }
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      }
    });

    this.client.activate();
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      console.log('WebSocket disconnected');
    }
  }

  onNotification(callback: NotificationCallback): void {
    this.callbacks.push(callback);
  }

  private notifyCallbacks(notification: notificationServices.Notification): void {
    this.callbacks.forEach(callback => callback(notification));
  }
}

// Export as a singleton
export const websocketService = new WebSocketService();