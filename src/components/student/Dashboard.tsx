"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Book, Calendar, Clock, BookOpen } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { IndianCalendar } from "@/components/IndianCalendar";
import NumberTicker from "@/components/magicui/number-ticker";
import { toast } from "sonner";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
}) => {
  return (
    <Card className="bg-white shadow-xl rounded-lg overflow-hidden transform transition-all hover:scale-[1.05]">
      <CardContent className="flex flex-col items-center p-6">
        <div className="mb-4 text-gray-800">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-4xl font-bold text-black mb-2">
          <NumberTicker value={Number(value)} />
        </p>
        <p className="text-sm text-gray-600 text-center">{description}</p>
      </CardContent>
    </Card>
  );
};

interface StudentInfoProps {
  id: string;
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
  pinCode?: number; // Make pinCode optional
}

const Dashboard: React.FC<{ studentInfo: StudentInfoProps }> = ({
  studentInfo,
}) => {
  const [totalSubjects, setTotalSubjects] = useState("0");

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `/api/student/fetchSubjects?studentId=${studentInfo.id}`
      );
      const data = await response.json();
      const totalSubjects = data.subjects.length;
      if (totalSubjects !== 0) setTotalSubjects(totalSubjects);
    } catch (error) {
      toast.error("Failed to fetch stats");
    }
  };

  useEffect(() => {
    fetchStats();
  }, [studentInfo.id]);

  const attendanceData = [
    { subject: "Big Data Analysis", totalClasses: 30, attendedClasses: 28 },
    { subject: "Network Security", totalClasses: 25, attendedClasses: 23 },
    { subject: "Machine Learning", totalClasses: 20, attendedClasses: 18 },
    {
      subject: "Reverse Engineering and Malware Analysis",
      totalClasses: 15,
      attendedClasses: 14,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <StatCard
            title="Pending Leaves"
            value="2"
            icon={<Calendar className="h-10 w-10" />}
            description="Remaining leave days"
          />
          <StatCard
            title="Total Subjects"
            value={totalSubjects}
            icon={<BookOpen className="h-10 w-10" />}
            description="Current semester"
          />
          <StatCard
            title="Overall Attendance"
            value="92"
            icon={<Clock className="h-10 w-10" />}
            description="Across all subjects"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-white shadow-xl rounded-lg overflow-hidden transform transition-all hover:scale-[1.02]">
            <CardHeader className="bg-black text-white p-6">
              <CardTitle className="text-2xl font-bold flex items-center">
                <User className="mr-3" /> Student Information
              </CardTitle>
              <p className="text-gray-300 mt-2">
                SITAICS (School of Information Technology)
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoSection
                  title="Personal Details"
                  icon={<User className="text-black" />}
                >
                  <InfoItem label="Name" value={studentInfo.name} />
                  <InfoItem
                    label="Father's Name"
                    value={studentInfo.fatherName}
                  />
                  <InfoItem
                    label="Mother's Name"
                    value={studentInfo.motherName}
                  />
                  <InfoItem
                    label="Date of Birth"
                    value={studentInfo.dateOfBirth}
                  />
                  <InfoItem label="Gender" value={studentInfo.gender} />
                  <InfoItem
                    label="Blood Group"
                    value={studentInfo.bloodGroup}
                  />
                </InfoSection>

                <InfoSection
                  title="Contact Information"
                  icon={<Mail className="text-black" />}
                >
                  <InfoItem label="Email" value={studentInfo.email} />
                  <InfoItem
                    label="Contact No."
                    value={studentInfo.contactNo || "N/A"}
                  />
                  <InfoItem label="Address" value={studentInfo.address} />
                  <InfoItem label="City" value={studentInfo.city} />
                  <InfoItem label="State" value={studentInfo.state} />
                  <InfoItem
                    label="PIN Code"
                    value={studentInfo.pinCode?.toString() || "NA"}
                  />
                </InfoSection>

                <InfoSection
                  title="Academic Information"
                  icon={<Book className="text-black" />}
                >
                  <InfoItem
                    label="Enrollment No"
                    value={studentInfo.enrollmentNumber}
                  />
                  <InfoItem label="Course" value={studentInfo.courseName} />
                  <InfoItem label="Batch No" value={studentInfo.batchName} />
                </InfoSection>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-xl rounded-lg overflow-hidden transform transition-all hover:scale-[1.02]">
            <CardHeader className="bg-black text-white">
              <CardTitle className="text-xl font-semibold flex items-center">
                <Calendar className="mr-2" /> Academic Calendar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <IndianCalendar />
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 bg-white shadow-xl rounded-lg overflow-hidden transform transition-all hover:scale-[1.02]">
          <CardHeader className="bg-black text-white">
            <CardTitle className="text-xl font-semibold flex items-center">
              <Clock className="mr-2" /> Attendance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={attendanceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="subject"
                  tick={{ fill: "#333", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#333", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f3f4f6",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "#1f2937" }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Bar
                  dataKey="totalClasses"
                  fill="#1f2937"
                  name="Total Classes"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="attendedClasses"
                  fill="#4b5563"
                  name="Attended Classes"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const InfoSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="bg-gray-50 p-5 rounded-lg shadow-inner">
    <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
      {icon}
      <span className="ml-2">{title}</span>
    </h3>
    {children}
  </div>
);

const InfoItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <p className="mb-3 text-sm">
    <span className="font-medium text-gray-700">{label}:</span>{" "}
    <span className="text-gray-900">{value}</span>
  </p>
);

export default Dashboard;
