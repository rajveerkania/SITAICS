import React from "react";

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
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Student Information</h2>
      <div className="border border-gray-300 rounded-lg p-4">
        <p className="font-semibold text-lg">
          SITAICS (School of Information Technology)
        </p>
        <p className="mt-2">
          <strong>Name:</strong> {studentInfo.name}
        </p>
        <p>
          <strong>Father's Name:</strong> {studentInfo.fatherName}
        </p>
        <p>
          <strong>Mother's Name:</strong> {studentInfo.motherName}
        </p>
        <p>
          <strong>Email:</strong> {studentInfo.email}
        </p>
        <p>
          <strong>Enrollment No.:</strong> {studentInfo.enrollmentNumber}
        </p>
        <p>
          <strong>Course:</strong> {studentInfo.courseName}
        </p>
        <p>
          <strong>Batch No.:</strong> {studentInfo.batchName}
        </p>
        <p>
          <strong>Date of Birth:</strong> {studentInfo.dateOfBirth}
        </p>
        <p>
          <strong>Gender:</strong> {studentInfo.gender}
        </p>
        <p>
          <strong>Contact No.:</strong> {studentInfo.contactNo}
        </p>
        <p>
          <strong>Address:</strong> {studentInfo.address}
        </p>
        <p>
          <strong>City:</strong> {studentInfo.city}
        </p>
        <p>
          <strong>State:</strong> {studentInfo.state}
        </p>
        <p>
          <strong>PIN Code:</strong> {studentInfo.pinCode}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
