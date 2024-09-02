import React, { useState, useEffect } from "react";
import Image from "next/image";
import { NotificationDialog } from "./admin/AdminNotification";
import { LogoutButton } from "./logoutbutton";
import { FaSignOutAlt } from "react-icons/fa";
import BlurIn from "./magicui/blur-in";

interface NavBarProps {
  name?: string;
}

export function Navbar({ name }: NavBarProps) {
  const [dateTime, setDateTime] = useState("");
  const greeting = `Welcome, ${name}`;
  const shortGreeting = `Welcome, ${name?.split(" ")[0]}`;

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
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-white shadow-md p-4 transition-all duration-300 hover:shadow-lg">
      <div className="container-fluid mx-auto flex flex-row justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="hidden sm:block pl-8">
            <Image
              src="/sitaics.png"
              alt="SITAICS Logo"
              width={90}
              height={90}
              priority
            />
          </div>
          <span className="text-xl font-medium text-gray-900">
            <BlurIn
              word={
                name ? (window.innerWidth < 640 ? shortGreeting : greeting) : ""
              }
            />
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden lg:block text-gray-600">{dateTime}</div>
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
