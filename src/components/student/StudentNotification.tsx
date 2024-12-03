import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';

interface Notification {
  id: string;
  batchName: string;
  message: string;
  courseName: string;
  createdAt: string;
  status: string;
  sender: {
    name: string;
    role: string;
  };
}

export const StudentNotification: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [scrollTopVisible, setScrollTopVisible] = useState(false);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await fetch('/api/notifications/receiveNotification', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (data.notifications) {
          setNotifications(data.notifications);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }

    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications/Mark_ReadNotification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId }),
      });

      const data = await response.json();
      if (data.success) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, status: 'READ' }
              : notification
          )
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleScroll = (e: React.UIEvent) => {
    const scrollHeight = e.currentTarget.scrollHeight;
    const scrollTop = e.currentTarget.scrollTop;
    const clientHeight = e.currentTarget.clientHeight;
    setScrollTopVisible(scrollTop + clientHeight < scrollHeight - 100); // Trigger scroll button when 100px from the bottom
  };

  const scrollToTop = () => {
    const notificationContainer = document.getElementById('notification-container');
    if (notificationContainer) {
      notificationContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full relative"
      >
        <Bell className="h-6 w-6 text-gray-600" />
        {/* Add notification badge if needed */}
        <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
          2
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="font-medium text-gray-900">Student Notifications</h3>
            <div
              id="notification-container"
              className="mt-2 max-h-60 overflow-y-auto space-y-2"
              onScroll={handleScroll}
            >
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-2 hover:bg-gray-50 rounded cursor-pointer"
                    onClick={() => markAsRead(notif.id)}
                  >
                    <p className="text-sm font-semibold text-gray-700">{notif.message}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      <p>
                        From: {notif.sender.name} ({notif.sender.role})
                      </p>
                      <p>{notif.courseName && `Course: ${notif.courseName}`}</p>
                      <p>{notif.batchName && `Batch: ${notif.batchName}`}</p>
                      <span className="text-gray-400">
                        {new Date(notif.createdAt).toLocaleDateString()} -{' '}
                        {new Date(notif.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <span
                      className={`mt-1 inline-block text-xs ${
                        notif.status === 'UNREAD' ? 'text-red-500' : 'text-gray-400'
                      }`}
                    >
                      {notif.status === 'UNREAD' ? 'New' : 'Read'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No notifications</p>
              )}
            </div>
            {scrollTopVisible && (
              <button
                onClick={scrollToTop}
                className="mt-2 text-xs text-blue-500 hover:text-blue-700"
              >
                Scroll to Top
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};