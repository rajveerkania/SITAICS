import React, { useState, useEffect } from "react";
import Image from "next/image";
import { NotificationDialog } from "@/components/admin/AdminNotification";
import BlurIn from "./magicui/blur-in";

interface NavBarProps {
  name?: string;
  role?: string;
}

export function Navbar({ name, role }: NavBarProps) {
  const [dateTime, setDateTime] = useState("");

  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

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
          <div className="relative">
            <div onClick={toggleDropdown} className="cursor-pointer">
              <Image
                src={role === "Admin" ? "/Admin-logo.png" : "/User-logo.png"}
                alt="Profile Logo"
                width={60}
                height={60}
              />
            </div>
            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg ">
                <li className="block px-4 py-2 text-black hover:bg-black hover:text-white cursor-pointer hover:rounded-t-lg">
                  My Profile
                </li>
                {role !== "Student" && (
                  <li className="block px-4 py-2 text-black hover:bg-black hover:text-white cursor-pointer">
                    Send Notification
                  </li>
                )}

                <li
                  className="block px-4 py-2 text-black hover:bg-black hover:text-white cursor-pointer hover:rounded-b-lg"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
