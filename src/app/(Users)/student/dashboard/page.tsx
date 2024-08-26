"use client";
import React, { useState } from "react";
import StudentAuthentication from "@/components/student/StudentAuthentication";
import { Navbar } from "@/components/Navbar";
import Navigation from "@/components/student/Navigation";
import Dashboard from "@/components/student/Dashboard";
import Timetable from "@/components/student/Timetable";
import ExamResults from "@/components/student/ExamResults";
import LeaveManagement from "@/components/student/LeaveManagement";
import Achievement from "@/components/student/Achievement";
import Feedback from "@/components/student/Feedback";

const Page: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [studentInfo, setStudentInfo] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    email: "",
    enrollmentNo: "",
    course: "",
    semester: "",
    batchNo: "",
    dob: "",
    gender: "",
    mobileNo: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
  });
  const [activeTab, setActiveTab] = useState("dashboard");

  if (!isAuthenticated) {
    return (
      <StudentAuthentication
        setIsAuthenticated={setIsAuthenticated}
        setStudentInfo={setStudentInfo}
        handleLogout={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="container mx-auto mt-8 px-4">
        {activeTab === "dashboard" && <Dashboard studentInfo={studentInfo} />}
        {activeTab === "timetable" && <Timetable timetableData={[]} />}
        {activeTab === "exam" && <ExamResults />}
        {activeTab === "leave" && <LeaveManagement />}
        {activeTab === "achievement" && <Achievement />}
        {activeTab === "feedback" && <Feedback />}
      </main>
    </div>
  );
};

export default Page;
