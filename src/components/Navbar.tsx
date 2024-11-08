import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import BlurIn from "@/components/magicui/blur-in";
import { AdminProfile } from "@/components/admin/AdminProfile";
import { StudentProfile } from "@/components/student/StudentProfile";
import Profile from "@/components/staff/Profile";
import { NotificationDialog } from "@/components/admin/AdminNotification";
import { StaffNotification } from "@/components/staff/StaffNotification";
import { StudentNotification } from "@/components/student/StudentNotification";

interface NavBarProps {
  name?: string;
  role?: "Admin" | "Staff" | "Student";
}

interface StudentDetails {
  fatherName: string;
  motherName: string;
  enrollmentNumber: string;
  courseName: string;
  batchName: string;
  dateOfBirth: string;
  gender: string;
  contactNo: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  bloodGroup: string;
}

interface StaffDetails {
  department: string;
  position: string;
  email: string;
  contactNo: string;
}

interface LoadingSkeletonProps {
  loadingText: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ loadingText }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-gray-700">
        Loading {loadingText}
      </p>
    </div>
  );
};

export function Navbar({ name, role }: NavBarProps) {
  const [dateTime, setDateTime] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const openProfile = () => {
    setProfileOpen(true);
    setDropdownOpen(false);
  };

  const closeProfile = () => {
    setProfileOpen(false);
  };

  const renderNotification = () => {
    switch (role) {
      case "Admin":
        return <NotificationDialog />;
      case "Staff":
        return <StaffNotification />;
      case "Student":
        return <StudentNotification />;
      default:
        return null;
    }
  };

  if (isLoggingOut) {
    return <LoadingSkeleton loadingText="Logging out..." />;
  }

  return (
    <nav className="bg-white shadow-md p-4 transition-all duration-300 hover:shadow-lg relative z-40">
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
                name
                  ? window.innerWidth < 640
                    ? shortGreeting
                    : greeting
                  : ""
              }
            />
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden lg:block text-gray-600">{dateTime}</div>
          
          <div className="z-50">
            {renderNotification()}
          </div>

          <div className="relative" ref={dropdownRef}>
            <div onClick={toggleDropdown} className="cursor-pointer">
              <Image
                src={
                  role === "Admin"
                    ? "/Admin-logo.png"
                    : "/User-logo.png"
                }
                alt="Profile Logo"
                width={60}
                height={60}
              />
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                <ul>
                  <li
                    className="block px-4 py-2 text-black hover:bg-black hover:text-white cursor-pointer hover:rounded-t-lg transition-colors duration-200"
                    onClick={openProfile}
                  >
                    {role === "Admin"
                      ? "Admin Profile"
                      : role === "Staff"
                      ? "Staff Profile"
                      : "Student Profile"}
                  </li>
                  <li
                    className="block px-4 py-2 text-black hover:bg-black hover:text-white cursor-pointer hover:rounded-b-lg transition-colors duration-200"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {profileOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Profile
              </h3>
              <div className="mt-2 px-7 py-3">
                {role === "Admin" ? (
                  <AdminProfile
                    name={name || "Admin"}
                    email="admin@example.com"
                    username="admin123"
                  />
                ) : role === "Staff" ? (
                  <Profile
                    staffDetails={{
                      department: "IT",
                      position: "Lecturer",
                      email: "staff@example.com",
                      contactNo: "9876543210",
                    }}
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
              <div className="items-center px-4 py-3">
                <button
                  onClick={closeProfile}
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
