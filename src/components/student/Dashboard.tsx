import React from "react";
import { StatCard } from "../StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StudentInfoProps {
  email: string;
  username: string;
  name: string;
  fatherName: string;
  motherName: string;
  enrollmentNumber: string;
  courseName: string;
  batchName: string;
  results: string | null;
  bloodGroup: string;
  dateOfBirth: string;
  gender: string;
  contactNo: string | null;
  address: string;
  city: string;
  state: string;
  pinCode: number;
}

const Dashboard: React.FC<{ studentInfo: StudentInfoProps }> = ({
  studentInfo,
}) => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Achievements" value="5" />
          <StatCard title="Classmates" value="30" /> 
          <StatCard title="Leave" value="2" /> 
        </div>

        {/* Student Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-lg">SITAICS (School of Information Technology)</p>
            <div className="mt-4">
              <p><strong>Name:</strong> {studentInfo.name}</p>
              <p><strong>Father's Name:</strong> {studentInfo.fatherName}</p>
              <p><strong>Mother's Name:</strong> {studentInfo.motherName}</p>
              <p><strong>Email:</strong> {studentInfo.email}</p>
              <p><strong>Enrollment No.:</strong> {studentInfo.enrollmentNumber}</p>
              <p><strong>Course:</strong> {studentInfo.courseName}</p>
              <p><strong>Batch No.:</strong> {studentInfo.batchName}</p>
              <p><strong>Date of Birth:</strong> {studentInfo.dateOfBirth}</p>
              <p><strong>Gender:</strong> {studentInfo.gender}</p>
              <p><strong>Contact No.:</strong> {studentInfo.contactNo}</p>
              <p><strong>Address:</strong> {studentInfo.address}</p>
              <p><strong>City:</strong> {studentInfo.city}</p>
              <p><strong>State:</strong> {studentInfo.state}</p>
              <p><strong>PIN Code:</strong> {studentInfo.pinCode}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
