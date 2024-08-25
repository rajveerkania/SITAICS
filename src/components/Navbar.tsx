import React, { useState, useEffect } from "react";
import Image from "next/image";
import { NotificationDialog } from "./admin/AdminNotification";
import { LogoutButton } from "./LogoutButton";
import { FaSignOutAlt } from "react-icons/fa";

export function Navbar() {
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      setDateTime(now.toLocaleString("en-US", options));
    };

    updateTime(); // Update immediately on component mount
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, []);

  return (
    <nav className="bg-white shadow-md p-4 transition-all duration-300 hover:shadow-lg">
      <div className="container-fluid mx-auto flex flex-row justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="hidden sm:block"> {/* Hide the logo on mobile view */}
            <Image
              src="/sitaics.png"
              alt="SITAICS Logo"
              width={50}
              height={50}
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </div>
          <span className="text-lg font-medium text-gray-900">Welcome, Harshil Khokhar</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden lg:block text-gray-600">
            {dateTime}
          </div>
          <NotificationDialog />
          <div className="hidden sm:block">
            <LogoutButton />
          </div>
          <div className="block sm:hidden">
            <FaSignOutAlt size={24} />
          </div>
        </div>
      </div>
    </nav>
  );
}
