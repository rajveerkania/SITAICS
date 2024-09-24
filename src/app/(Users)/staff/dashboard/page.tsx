"use client";
import React, { useState } from "react";
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

const FacultyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isBatchCoordinator] = useState(true);
  const [userInfo, setUserInfo] = useState<any>({});
   const [loading, setLoading] = useState(true);
  const [showAddStudentDetails, setShowAddStudentDetails] = useState(false);


  return (
    <div className="min-h-screen bg-gray-100">
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
    </div>
  );
};

export default FacultyDashboard;  