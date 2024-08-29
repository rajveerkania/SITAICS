"use client";
import React, { useState } from "react";
import StudentAuthentication from "@/components/student/StudentAuthentication";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/student/Dashbord";
import Timetable from "@/components/student/Timetable";
import ExamResults from "@/components/student/ExamResults";
import LeaveManagement from "@/components/student/LeaveManagement";
import Achievement from "@/components/student/Achievement";
import Feedback from "@/components/student/Feedback";

type StudentInfo = any ;

const Page: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
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
        setStudentInfo={(info: StudentInfo) => setStudentInfo(info)}
        handleLogout={() => {
          setIsAuthenticated(false);
          setStudentInfo({
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
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto mt-8 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex flex-wrap justify-start gap-2 mb-8">
            <TabsTrigger value="dashboard" className="flex-grow basis-full sm:basis-1/2 md:basis-auto text-center">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="timetable" className="flex-grow basis-full sm:basis-1/2 md:basis-auto text-center">
              Timetable
            </TabsTrigger>
            <TabsTrigger value="exam" className="flex-grow basis-full sm:basis-1/2 md:basis-auto text-center">
              Exam Results
            </TabsTrigger>
            <TabsTrigger value="leave" className="flex-grow basis-full sm:basis-1/2 md:basis-auto text-center">
              Leave Management
            </TabsTrigger>
            <TabsTrigger value="achievement" className="flex-grow basis-full sm:basis-1/2 md:basis-auto text-center">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex-grow basis-full sm:basis-1/2 md:basis-auto text-center">
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard studentInfo={studentInfo} />
          </TabsContent>

          <TabsContent value="timetable">
            <Timetable timetableData={[]} />
          </TabsContent>

          <TabsContent value="exam">
            <ExamResults />
          </TabsContent>

          <TabsContent value="leave">
            <LeaveManagement />
          </TabsContent>

          <TabsContent value="achievement">
            <Achievement />
          </TabsContent>

          <TabsContent value="feedback">
            <Feedback />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
