"use client";
import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import Navigation from "@/components/staff/Navigation";
import Dashboard from "@/components/staff/Dashboard";
import Result from "@/components/staff/Result";
import Leave from "@/components/staff/Leave";
import Notification from "@/components/staff/Notification";
import Attendance from "@/components/staff/Attendence";
import StudentList from "@/components/staff/StudentList";
import Timetable from "@/components/staff/Timetable";
import AddStaffDetails from "@/components/staff/AddStaffDetails";
import Profile from "@/components/staff/Profile";
import Achievements from "@/components/staff/Achievement";
import LoadingSkeleton from "@/components/LoadingSkeleton";

const FacultyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userInfo, setUserInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [showAddStaffDetails, setShowAddStaffDetails] = useState(false);

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

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (loading) {
    return <LoadingSkeleton loadingText="Faculty Dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <>
          <Navbar />
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="container mx-auto mt-8 px-4">
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "notifications" && <Notification isBatchCoordinator={false} />}
            {activeTab === "leave" && <Leave />}
            {activeTab === "timetable" && <Timetable />}
            {activeTab === "results" && <Result />}
            {activeTab === "achievements" && <Achievements />}
            {activeTab === "students" && <StudentList />}
            {activeTab === "attendance" && <Attendance />}
            {activeTab === "profile" && <Profile />}
          </main>
        </>
      {/* {showAddStaffDetails ? (
        <AddStaffDetails
          id={userInfo.id}
          setShowAddStaffDetails={setShowAddStaffDetails}
          fetchUserDetails={fetchUserDetails}
        />
      ) : (
        <>
          <Navbar />
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="container mx-auto mt-8 px-4">
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "notifications" && <Notification />}
            {activeTab === "leave" && <Leave />}
            {activeTab === "timetable" && <Timetable />}
            {activeTab === "results" && <Result />}
            {activeTab === "achievements" && <Achievements />}
            {activeTab === "students" && <StudentList />}
            {activeTab === "attendance" && <Attendance />}
            {activeTab === "profile" && <Profile />}
          </main>
        </>
      )} */}
    </div>
  );
};

export default FacultyDashboard;