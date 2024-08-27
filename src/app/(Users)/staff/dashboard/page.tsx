"use client";
import React, { useState } from "react";
import Head from "next/head";
import { Navbar } from "@/components/Navbar";
import Navigation from "@/components/staff/Navigation";
import Dashboard from "@/components/staff/Dashboard";
import Result from "@/components/staff/Result";
import Leave from "@/components/staff/Leave";
import Notification from "@/components/staff/Notification";
import Attendance from "@/components/staff/Attendence";
import StudentList from "@/components/staff/StudentList";
import Timetable from "@/components/staff/Timetable";

const FacultyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isBatchCoordinator] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>SITAICS Faculty Portal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto mt-8 px-4">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "notifications" && <Notification />}
        {activeTab === "leave" && <Leave />}
        {activeTab === "Timetable" && <Timetable />}
        {activeTab === "results" && <Result />}
        {activeTab === "students" && <StudentList />}
        {activeTab === "attendence" && <Attendance />}
      </main>
    </div>
  );
};

export default FacultyDashboard;
