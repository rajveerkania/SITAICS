import React from "react";
import { StatCard } from "@/components/StatCard";
import { IndianCalendar } from "../IndianCalendar";

interface DashboardProps {
  studentInfo: {
    name: string;
    fatherName: string;
    motherName: string;
    email: string;
    enrollmentNo: string;
    course: string;
    semester: string;
    batchNo: string;
    dob: string;
    gender: string;
    mobileNo: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
  };
  stats: {
    totalStudents: number;
    totalCourses: number;
    totalStaff: number;
    upcomingEvents: number;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ studentInfo, stats }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Student Dashboard</h2>

      {/* Stat Cards Section - Moved to the top */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Students" value={125} />
        <StatCard title="Total Courses" value={12} />
        <StatCard title="Total Staff" value={10} />
      </div>

      {/* Student Information Section */}
      <h3 className="text-xl font-bold mb-4">Student Information</h3>
      <div className="border border-gray-300 rounded-lg p-4 mb-8">
        <p className="font-semibold text-lg">SITAICS (School of Information Technology)</p>
        <p className="mt-2"><strong>Name:</strong> {studentInfo.name}</p>
        <p><strong>Father's Name:</strong> {studentInfo.fatherName}</p>
        <p><strong>Mother's Name:</strong> {studentInfo.motherName}</p>
        <p><strong>Email:</strong> {studentInfo.email}</p>
        <p><strong>Enrollment No.:</strong> {studentInfo.enrollmentNo}</p>
        <p><strong>Course:</strong> {studentInfo.course}</p>
        <p><strong>Semester:</strong> {studentInfo.semester}</p>
        <p><strong>Batch No.:</strong> {studentInfo.batchNo}</p>
        <p><strong>Date of Birth:</strong> {studentInfo.dob}</p>
        <p><strong>Gender:</strong> {studentInfo.gender}</p>
        <p><strong>Mobile No.:</strong> {studentInfo.mobileNo}</p>
        <p><strong>Address:</strong> {studentInfo.address}</p>
        <p><strong>City:</strong> {studentInfo.city}</p>
        <p><strong>State:</strong> {studentInfo.state}</p>
        <p><strong>PIN Code:</strong> {studentInfo.pinCode}</p>
      </div>

      {/* Calendar Component Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Calendar</h3>
        <IndianCalendar />
      </div>
    </div>
  );
};

export default Dashboard;