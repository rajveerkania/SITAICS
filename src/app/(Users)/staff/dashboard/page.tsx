"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/staff/Dashboard";
import Result from "@/components/staff/Result";
import Attendance from "@/components/staff/Attendance";
import StudentList from "@/components/staff/StudentList";
import Timetable from "@/components/staff/Timetable";
import Achievements from "@/components/staff/Achievement";
import Leave from "@/components/staff/Leave";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Toaster, toast } from "sonner";
import AddStaffDetails from "@/components/staff/AddStaffDetails";


const FacultyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [ShowAddStaffDetails, setShowAddStaffDetails] = useState(false);

  const tabs = [
    "Overview",
    "Student List",
    "Timetable",
    "Result",
    "Achievement",
    "Attendance",
    "Leave",
  ];

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`/api/fetchUserDetails`);
      const data = await response.json();
      if (response.status !== 200) {
        toast.error(data.message || "Error fetching user data");
      }
      if (data.user.isProfileCompleted) {
        setUserInfo(data.user);
      } else {
        setUserInfo({ id: data.user.id, name: "", isProfileCompleted: false });
        setShowAddStaffDetails(true);
      }
    } catch (error) {
      toast.error("Error fetching user details!");
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
    return <LoadingSkeleton loadingText="Faculty Dashboard" />;
  }

  if (ShowAddStaffDetails) {
    return (
      <AddStaffDetails
        id={userInfo.id}
        setShowAddStaffDetails={setShowAddStaffDetails}
        fetchUserDetails={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      <Navbar name={userInfo?.name || ""} role="Faculty" />
      <div className="container mx-auto mt-8 px-4">
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
              <li key={tab} className="w-full">
                <button
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-300 ease-in-out transform hover:scale-105 ${
                    activeTab === tab.toLowerCase()
                      ? "bg-gray-900 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                  onClick={() => {
                    setActiveTab(tab.toLowerCase());
                    toggleMobileMenu();
                  }}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Tab Navigation */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="hidden lg:flex flex-wrap justify-start gap-2 mb-8 p-4 bg-white text-black rounded-lg shadow-md">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab.toLowerCase()}
                className={`flex-grow basis-full sm:basis-1/2 md:basis-auto text-center px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ease-in-out ${
                  activeTab === tab.toLowerCase()
                    ? "bg-gray-900 text-white shadow-md border-b-4 border-gray-600 z-10 relative"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
                onClick={() => setActiveTab(tab.toLowerCase())}
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="overview">
            <Dashboard />
          </TabsContent>
          <TabsContent value="student list">
            <StudentList />
          </TabsContent>
          <TabsContent value="timetable">
            <Timetable />
          </TabsContent>
          <TabsContent value="result">
            <Result />
          </TabsContent>
          <TabsContent value="achievement">
            <Achievements userId={userInfo.id} userRole="Staff" />
          </TabsContent>
          <TabsContent value="attendance">
            <Attendance />
          </TabsContent>
          <TabsContent value="leave">
            <Leave />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FacultyDashboard;