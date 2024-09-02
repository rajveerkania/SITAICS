"use client";
import React, { useEffect, useState } from "react";

import { Navbar } from "@/components/Navbar";
import Dashboard from "@/components/student/Dashboard";
import Timetable from "@/components/student/Timetable";
import ExamResults from "@/components/student/ExamResults";
import LeaveManagement from "@/components/student/LeaveManagement";
import Achievement from "@/components/student/Achievement";
import Feedback from "@/components/student/Feedback";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import AddStudentDetails from "@/components/student/AddStudentDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StudentDashboard: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>({});
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [showAddStudentDetails, setShowAddStudentDetails] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`/api/fetchUserDetails`);
      const data = await response.json();
      if (data.user.isProfileCompleted) {
        setUserInfo(data.user);
      } else {
        setUserInfo({ id: data.user.id });
        setShowAddStudentDetails(true);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (loading) {
    return <LoadingSkeleton loadingText="Dashboard" />;
  }

  const tabs = [
    { label: "Dashboard", value: "dashboard" },
    { label: "Timetable", value: "timetable" },
    { label: "Exam Results", value: "exam" },
    { label: "Leave Management", value: "leave" },
    { label: "Achievements", value: "achievement" },
    { label: "Feedback", value: "feedback" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {showAddStudentDetails ? (
        <AddStudentDetails
          id={userInfo.id}
          setShowAddStudentDetails={setShowAddStudentDetails}
          fetchUserDetails={fetchUserDetails}
        />
      ) : (
        <>
          <Navbar name={userInfo.name} />
          <div className="container mx-auto mt-8 px-4">
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
                {tabs.map((tab) => (
                  <li key={tab.value} className="w-full">
                    <button
                      className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-300 ease-in-out transform hover:scale-105 ${
                        activeTab === tab.value
                          ? "bg-gray-900 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                      onClick={() => {
                        setActiveTab(tab.value);
                        toggleMobileMenu(); // Close menu after selection
                      }}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Desktop Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="hidden lg:flex flex-wrap gap-2 mb-8">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex-grow text-center"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Content for each Tab */}
              <TabsContent value="dashboard">
                <Dashboard studentInfo={userInfo} />
              </TabsContent>
              <TabsContent value="timetable">
                <Timetable timetableData={[]} />
              </TabsContent>
              <TabsContent value="exam">
                <ExamResults />
              </TabsContent>
              <TabsContent value="leave">
                <LeaveManagement />
              </TabsContent>
              <TabsContent value="achievement">
                <Achievement />
              </TabsContent>
              <TabsContent value="feedback">
                <Feedback />
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
