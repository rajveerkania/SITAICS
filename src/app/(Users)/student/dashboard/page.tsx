"use client";
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import Dashboard from "@/components/student/Dashboard";
import Timetable from "@/components/student/Timetable";
import ExamResults from "@/components/student/ExamResults";
import LeaveRequest from "@/components/student/LeaveRequest";
import Achievement from "@/components/student/Achievement";
import SubjectTab from "@/components/student/SubjectTab";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import AddStudentDetails from "@/components/student/AddStudentDetails";
import { toast } from "sonner";
import Placement from "@/components/student/Placement";
import AttendanceTab from "@/components/student/AttendanceTab";

interface UserInfo {
  id: string;
  name: string;
  isProfileCompleted: boolean;
  email: string;
  username: string;
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

const StudentDashboard: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userRole, setUserRole] = useState<string>("null");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddStudentDetails, setShowAddStudentDetails] =
    useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const tabs = [
    "Overview",
    "Timetable",
    "Subjects",
    "Attendance",
    "Leave Request",
    "Exam Results",
    "Achievements",
    "Placement",
  ];

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`/api/fetchUserDetails`);
      const data = await response.json();
      if (data.user.isProfileCompleted) {
        setUserInfo(data.user);
        setUserRole(data.role);
      } else {
        setUserInfo({
          id: data.user.id,
          name: "",
          isProfileCompleted: false,
        } as UserInfo);
        setShowAddStudentDetails(true);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Error fetching user details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (loading) {
    return <LoadingSkeleton loadingText="Dashboard" />;
  }

  if (showAddStudentDetails && userInfo) {
    return (
      <AddStudentDetails
        id={userInfo.id}
        setShowAddStudentDetails={setShowAddStudentDetails}
        fetchUserDetails={fetchUserDetails}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar name={userInfo?.name || ""} role={userRole} />
      <div className="container mx-auto mt-8 px-4">
        <div className="lg:hidden mb-4">
          <button
            className="p-2 rounded-md bg-gray-200 hover:bg-gray-300"
            onClick={toggleMobileMenu}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
        <div
          className={`${
            isMobileMenuOpen ? "flex" : "hidden"
          } lg:hidden flex-col bg-gray-800 absolute top-0 left-0 w-full h-full p-4 z-10 transition-all duration-300 ease-in-out`}
        >
          <button
            className="self-end p-2 rounded-md hover:bg-gray-700"
            onClick={toggleMobileMenu}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <ul className="mt-6 space-y-4">
            {tabs.map((tab) => (
              <li key={tab} className="w-full">
                <button
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-300 ease-in-out transform hover:scale-105  ${
                    activeTab === tab.toLowerCase()
                      ? "bg-gray-900 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                  onClick={() => {
                    setActiveTab(tab.toLowerCase());
                    toggleMobileMenu();
                  }}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
          defaultValue="overview"
        >
          <TabsList className="hidden lg:flex flex-wrap justify-start gap-2 mb-8 p-4 bg-white text-black rounded-lg shadow-md">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab.toLowerCase()}
                className={`
                  flex-grow basis-full sm:basis-1/2 md:basis-auto
                  text-center px-4 py-2 rounded-md
                  font-medium text-sm
                  transition-all duration-200 ease-in-out
                  ${
                    activeTab === tab.toLowerCase()
                      ? "bg-gray-900 text-white shadow-sm"
                      : "bg-gray-200 text-black hover:bg-gray-300"
                  }
                `}
                onClick={() => setActiveTab(tab.toLowerCase())}
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview">
            {userInfo && <Dashboard studentInfo={userInfo} />}
          </TabsContent>

          <TabsContent value="timetable">
            <Card>
              <CardHeader>
                <CardTitle>Timetable</CardTitle>
              </CardHeader>
              <CardContent>
                <Timetable timetableData={[]} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects">
            <Card>
              <CardHeader>
                <CardTitle>Subjects</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add your subjects content here */}
                <SubjectTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                {/* <CardTitle>Attendance overview</CardTitle> */}
              </CardHeader>
              <CardContent>
                {/* Add your attendance content here */}
                <AttendanceTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leave request">
            <Card>
              <CardHeader>
                <CardTitle>Leave Request</CardTitle>
              </CardHeader>
              <CardContent>
                <LeaveRequest />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exam results">
            <Card>
              <CardHeader>
                <CardTitle>Exam Results</CardTitle>
              </CardHeader>
              <CardContent>
                <ExamResults />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <Achievement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="placement">
            <Card>
              <CardHeader>
                <CardTitle>Placement & Internships</CardTitle>
              </CardHeader>
              <CardContent>
                <Placement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;
