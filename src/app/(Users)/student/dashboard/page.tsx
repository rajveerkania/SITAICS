"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import AddStudentDetails from "@/components/student/AddStudentDetails";
import Dashboard from "@/components/student/Dashboard";
import Timetable from "@/components/student/Timetable";
import ExamResults from "@/components/student/ExamResults";
import LeaveManagement from "@/components/student/LeaveManagement";
import Achievement from "@/components/student/Achievement";
import Feedback from "@/components/student/Feedback";
import { Toaster, toast } from "sonner";

const StudentDashboard = () => {
  const [userInfo, setUserInfo] = useState<any>({});
  const [userRole, setUserRole] = useState("null");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [showAddStudentDetails, setShowAddStudentDetails] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    "Dashboard",
    "Timetable",
    "Exam Results",
    "Leave Management",
    "Achievements",
    "Feedback",
  ];

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/fetchUserDetails`);
        const data = await response.json();
        if (data.user.isProfileCompleted) {
          setUserInfo(data.user);
          setUserRole(data.role);
        } else {
          setUserInfo({ id: data.user.id });
          setShowAddStudentDetails(true);
        }
      } catch (error) {
        toast.error("Error fetching user details!");
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (loading) {
    return <LoadingSkeleton loadingText="Dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      {showAddStudentDetails ? (
        <AddStudentDetails
          id={userInfo.id}
          setShowAddStudentDetails={setShowAddStudentDetails} fetchUserDetails={function (): void {
            throw new Error("Function not implemented.");
          } }        />
      ) : (
        <>
          <Navbar name={userInfo.name} role={userRole} />
          <div className="container mx-auto mt-8 px-4">
            {/* Mobile Menu Button */}
            <div className="lg:hidden mb-4">
              <button
                className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 focus:bg-gray-300"
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

            {/* Mobile Navigation */}
            <div
              className={`${
                isMobileMenuOpen ? "flex" : "hidden"
              } lg:hidden flex-col bg-gray-800 absolute top-0 left-0 w-full h-full p-4 z-10 transition-all duration-300 ease-in-out`}
            >
              <button
                className="self-end p-2 rounded-md hover:bg-gray-700 focus:bg-gray-700"
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
                      className={`w-full text-left px-4 py-2 rounded-md ${
                        activeTab === tab.toLowerCase()
                          ? "bg-gray-900 text-white"
                          : "bg-gray-800 text-gray-300"
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

            {/* Desktop Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="hidden lg:flex flex-wrap justify-start gap-2 mb-8">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab.toLowerCase()}
                    className="flex-grow basis-full sm:basis-1/2 md:basis-auto text-center"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Dashboard Tab Content */}
              <TabsContent value="dashboard">
                <Dashboard studentInfo={userInfo} />
              </TabsContent>

              {/* Timetable Tab Content */}
              <TabsContent value="timetable">
                <Timetable timetableData={[]} />
              </TabsContent>

              {/* Exam Results Tab Content */}
              <TabsContent value="exam results">
                <ExamResults />
              </TabsContent>

              {/* Leave Management Tab Content */}
              <TabsContent value="leave management">
                <LeaveManagement />
              </TabsContent>

              {/* Achievements Tab Content */}
              <TabsContent value="achievements">
                <Achievement />
              </TabsContent>

              {/* Feedback Tab Content */}
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
