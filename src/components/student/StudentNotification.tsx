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
  };


export const StudentNotification: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

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

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full relative"
      >
        <Bell className="h-6 w-6 text-gray-600" />
        {notifications.some((notif) => notif.status === 'UNREAD') && (
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            {notifications.filter((notif) => notif.status === 'UNREAD').length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="font-medium text-gray-900">Student Notifications</h3>
            <div className="mt-2 space-y-2">
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
                      <p>
                        {notif.courseName && `Course: ${notif.courseName}`}
                      </p>
                      <p>
                        {notif.batchName && `Batch: ${notif.batchName}`}
                      </p>
                      {/* {notif.subject?.subjectName && (
                        <p>Subject: {notif.notification.subject.subjectName}</p>
                      )} */}
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
          </div>
        </div>
      )}
    </div>
  );
};
