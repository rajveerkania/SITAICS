import React, { useState } from "react";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    "Dashboard",
    "Timetable",
    "Exam",
    "Achievement",
    "Leave",
    "Feedback",
  ];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <button
          className="block lg:hidden p-2 rounded-md hover:bg-gray-700"
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

        {/* Mobile Menu */}
        <div
          className={`${
            isMobileMenuOpen ? "flex" : "hidden"
          } lg:hidden flex-col bg-gray-800 absolute top-0 left-0 w-full h-full p-4 z-10 transition-all duration-300 ease-in-out`}
        >
          <button
            className="self-end p-2 rounded-md hover:bg-gray-700"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <ul className="mt-6 space-y-4">
            {tabs.map((item) => (
              <li key={item} className="w-full">
                <button
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-300 ease-in-out transform hover:scale-105 ${
                    activeTab === item.toLowerCase()
                      ? "bg-gray-900"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                  onClick={() => {
                    setActiveTab(item.toLowerCase());
                    toggleMobileMenu(); // Close menu after selection
                  }}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex lg:flex-row lg:space-x-4 py-2">
          {tabs.map((item) => (
            <li key={item} className="w-full lg:w-auto">
              <button
                className={`w-full lg:w-auto px-4 py-2 rounded-md transition-colors duration-300 ease-in-out transform hover:scale-105 ${
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
      </div>
    </nav>
  );
};

export default Navigation;
