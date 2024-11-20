import React, { useState } from "react";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    "Dashboard",
    "Notifications",
    "Leave",
    "MyTimetable",
    "MyBatch",
    "Results",
    "Achievements",
    "Students",
    "Attendance",
    "Profile"
  ];
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-100">
      <div className="container mx-auto px-4 py-2">
        {/* Mobile Menu Button */}
        <div className="lg:hidden mb-4">
          <button
            className="p-2 rounded-md bg-gray-200 hover:bg-gray-300"
            onClick={toggleMobileMenu}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } lg:hidden bg-white rounded-md shadow-md mb-4`}
        >
          <ul className="py-2">
            {tabs.map((tab) => (
              <li key={tab} className="px-4 py-2">
                <button
                  className={`w-full text-left ${
                    activeTab === tab.toLowerCase()
                      ? "font-bold text-black"
                      : "text-gray-700 hover:text-gray-600"
                  }`}
                  onClick={() => {
                    setActiveTab(tab.toLowerCase());
                    toggleMobileMenu(); // Close the menu after selection
                  }}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop Navigation Menu */}
        <div className="hidden lg:flex flex-wrap justify-start gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`flex-grow basis-full sm:basis-1/2 md:basis-auto text-center px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.toLowerCase()
                  ? "font-bold text-black bg-gray-200"
                  : "text-gray-700 hover:text-gray-600"
              }`}
              onClick={() => setActiveTab(tab.toLowerCase())}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

