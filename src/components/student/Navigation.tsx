import React from "react";
import { LogoutButton } from "@/components/LogoutButton";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = ["Dashboard", "Timetable", "Exam", "Achievement", "Leave", "Feedback"];

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <ul className="flex space-x-4 py-2">
          {tabs.map((item) => (
            <li key={item}>
              <button
                className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                  activeTab === item.toLowerCase()
                    ? "bg-gray-900"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
                onClick={() => setActiveTab(item.toLowerCase())}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
        <LogoutButton />
      </div>
    </nav>
  );
};

export default Navigation;