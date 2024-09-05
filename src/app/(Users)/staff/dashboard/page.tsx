"use client";
import React, { useState } from "react";
import Image from "next/image";

interface FacultyInfo {
  name: string;
  email: string;
  employeeId: string;
  department: string;
  designation: string;
  joinDate: string;
  mobileNo: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
}

interface Notification {
  recipient: string;
  message: string;
}

interface LeaveRequest {
  startDate: string;
  endDate: string;
  reason: string;
}

interface ResultReport {
  course: string;
  semester: string;
  file: File | null;
}

interface Student {
  name: string;
  rollNumber: string;
  present: boolean;
}

interface Attendance {
  course: string;
  date: string;
  students: Student[];
}

const FacultyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isBatchCoordinator] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/logo.png" alt="SITAICS" width={50} height={50} />
            <h1 className="ml-2 text-xl font-bold text-gray-700">SITAICS</h1>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-gray-700">
              Welcome {facultyInfo.name}
            </span>
            <Image
              src="/profile.png"
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full border-2 border-gray-300"
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto mt-8 px-4">
        <nav className="bg-gray-800 text-white mb-8">
          <ul className="flex flex-wrap">
            {[
              "Dashboard",
              "Notifications",
              "Leave",
              "Results",
              "Students",
              "Attendance",
              "Timetable",
            ].map((item) => (
              <li key={item}>
                <button
                  onClick={() => setActiveTab(item.toLowerCase())}
                  className={`px-4 py-2 transition-all duration-300 ${
                    activeTab === item.toLowerCase()
                      ? "bg-gray-700"
                      : "hover:bg-gray-600"
                  }`}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main>
          {activeTab === "dashboard" && renderDashboardContent()}
          {activeTab === "notifications" && renderNotificationsForm()}
          {activeTab === "leave" && renderLeaveRequestForm()}
          {activeTab === "results" && renderResultReportForm()}
          {activeTab === "students" && renderStudentList()}
          {activeTab === "attendance" && renderAttendanceForm()}
          {activeTab === "timetable" && renderTimetableUploadForm()}
        </main>
      </div>
    </div>
  );
};

export default FacultyDashboard;