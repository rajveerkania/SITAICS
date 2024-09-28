"use client";
import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/staff/Dashboard";
import Result from "@/components/staff/Result";
import Leave from "@/components/staff/Leave";
import Notification from "@/components/staff/Notification";
import Attendance from "@/components/staff/Attendence";
import StudentList from "@/components/staff/StudentList";
import Timetable from "@/components/staff/Timetable";
import Profile from "@/components/staff/Profile";
import Achievements from "@/components/staff/Achievement";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { group } from "console";

const FacultyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>({});
  const [showAddStaffDetails, setShowAddStaffDetails] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/fetchUserDetails`);
        const data = await response.json();
        if (data.user.isProfileCompleted) {
          setUserInfo(data.user);
        } else {
          setUserInfo({ id: data.user.id });
          setShowAddStaffDetails(true);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return <LoadingSkeleton loadingText="Faculty Dashboard" />;
  }

  const tabs = [
    { label: "Dashboard", value: "dashboard" },
    { label: "Notifications", value: "notifications" },
    { label: "Leave", value: "leave" },
    { label: "Timetable", value: "timetable" },
    { label: "Results", value: "results" },
    { label: "Achievements", value: "achievements" },
    { label: "Students", value: "students" },
    { label: "Attendance", value: "attendance" },
    { label: "Profile", value: "profile" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto mt-8 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap gap-2 mb-8 p-4 bg-white rounded-lg shadow-md">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={`flex-grow text-center px-4 py-2 rounded-md font-medium text-sm transition-all ${
                  activeTab === tab.value
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>
          <TabsContent value="notifications">
            <Notification isBatchCoordinator={false} />
          </TabsContent>
          <TabsContent value="leave">
            <Leave />
          </TabsContent>
          <TabsContent value="timetable">
            <Timetable />
          </TabsContent>
          <TabsContent value="results">
            <Result />
          </TabsContent>
          <TabsContent value="achievements">
            <Achievements />
          </TabsContent>
          <TabsContent value="students">
            <StudentList />
          </TabsContent>
          <TabsContent value="attendance">
            <Attendance />
          </TabsContent>
          <TabsContent value="profile">
            <Profile />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FacultyDashboard;
