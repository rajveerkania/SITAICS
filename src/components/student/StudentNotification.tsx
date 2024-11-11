import React, { useState } from 'react';
import { Bell } from 'lucide-react';

export const StudentNotification: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

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
            <div className="mt-2 space-y-2">
              {/* Add your student-specific notifications here */}
              <div className="p-2 hover:bg-gray-50 rounded">
                <p className="text-sm">New assignment posted in Mathematics</p>
                <span className="text-xs text-gray-500">1 hour ago</span>
              </div>
              <div className="p-2 hover:bg-gray-50 rounded">
                <p className="text-sm">Upcoming test reminder: Computer Science</p>
                <span className="text-xs text-gray-500">3 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};