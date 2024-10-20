import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { NotificationDialog } from "@/components/admin/AdminNotification";
import BlurIn from "./magicui/blur-in";
import { AdminProfile } from "@/components/admin/AdminProfile";
import { StudentProfile } from "@/components/student/StudentProfile";

interface NavBarProps {
  name?: string;
  role?: string;
}

export function Navbar({ name, role }: NavBarProps) {
  const [dateTime, setDateTime] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownOpen]);

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

  const openProfile = () => {
    setProfileOpen(true);
    setDropdownOpen(false);
  };

  const closeProfile = () => {
    setProfileOpen(false);
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
          {role === "Admin" && <NotificationDialog />}
          <div className="relative " ref={dropdownRef}>
            <div onClick={toggleDropdown} className="cursor-pointer">
              <Image
                src={role === "Admin" ? "/Admin-logo.png" : "/User-logo.png"}
                alt="Profile Logo"
                width={60}
                height={60}
              />
            </div>
            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                <li
                  className="block px-4 py-2 text-black hover:bg-black hover:text-white cursor-pointer hover:rounded-t-lg"
                  onClick={openProfile}
                >
                  {role === "Admin" ? "Admin Profile" : "Student Profile"}
                </li>
                {role === "Admin" && (
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

      {/* Profile Modal */}
      {profileOpen && (
        <div className="profile-modal fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative">
            <button
              onClick={closeProfile}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
            >
              &times;
            </button>
            {role === "Admin" ? (
              <AdminProfile
                name={name || "Default Admin Name"}
                email="admin@example.com"
                username="admin123"
              />
            ) : (
              <StudentProfile
                studentDetails={{
                  fatherName: "John Doe",
                  motherName: "Jane Doe",
                  enrollmentNumber: "EN123456",
                  courseName: "Computer Science",
                  batchName: "Batch 2023",
                  dateOfBirth: "1999-01-01",
                  gender: "Male",
                  contactNo: "1234567890",
                  address: "123 Main St",
                  city: "CityName",
                  state: "StateName",
                  pinCode: "123456",
                  bloodGroup: "O+",
                }}
              />
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
