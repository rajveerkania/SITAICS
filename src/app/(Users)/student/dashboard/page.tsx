"use client";
import React, { useEffect, useState } from "react";

import { Navbar } from "@/components/Navbar";
import Navigation from "@/components/student/Navigation";
import Dashboard from "@/components/student/Dashboard";
import Timetable from "@/components/student/Timetable";
import ExamResults from "@/components/student/ExamResults";
import LeaveManagement from "@/components/student/LeaveManagement";
import Achievement from "@/components/student/Achievement";
import Feedback from "@/components/student/Feedback";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import AddStudentDetails from "@/components/student/AddStudentDetails";

const Page: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>({});
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [showAddStudentDetails, setShowAddStudentDetails] = useState(false);

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

  if (loading) {
    return <LoadingSkeleton loadingText="Dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {showAddStudentDetails ? (
        <AddStudentDetails
          id={userInfo.id}
          setShowAddStudentDetails={setShowAddStudentDetails}
          fetchUserDetails={fetchUserDetails}
        />
      ) : (
        <>
          <Navbar name={userInfo.name} />
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="container mx-auto mt-8 px-4">
            {activeTab === "dashboard" && <Dashboard studentInfo={userInfo} />}
            {activeTab === "timetable" && <Timetable timetableData={[]} />}
            {activeTab === "exam" && <ExamResults />}
            {activeTab === "leave" && <LeaveManagement />}
            {activeTab === "achievement" && <Achievement />}
            {activeTab === "feedback" && <Feedback />}
          </main>
        </>
      )}
    </div>
  );
};

export default Page;
