export const fetchUserNotifications = async () => {
  try {
    const response = await fetch('/api/notifications/get');
    if (!response.ok) throw new Error('Failed to fetch notifications');
    const data = await response.json();
    return data.notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const response = await fetch('/api/notifications/mark-read', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ notificationId })
    });
    if (!response.ok) throw new Error('Failed to mark notification as read');
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

export const sendNotification = async (notificationData: Notification) => {
  try {
    const response = await fetch('/api/notifications/send', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notificationData)
    });

    if (!response.ok) throw new Error('Failed to send notification');
    return await response.json();
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};