"use client";

import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/StatCard";
import { IndianCalendar } from "@/components/IndianCalendar";
import { UserDetailsDialog } from "@/components/admin/UserDetailsDialog";
import { Navbar } from "@/components/Navbar";
import UsersTab from "@/components/admin/UsersTab";
import CoursesTab from "@/components/admin/CoursesTab";
import SubjectsTab from "@/components/admin/SubjectsTab";
import LeavesTab from "@/components/admin/LeavesTab";
import AttendanceTab from "@/components/admin/Attendance";
import BatchTab from "@/components/admin/BatchTab";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Toaster, toast } from "sonner";
import AccessDenied from "@/components/accessDenied";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CourseData {
  course: string;
  students: number;
}

interface Stats {
  studentCount: number;
  staffCount: number;
  totalCoursesCount: number;
  formattedStudentData: CourseData[];
}

const AdminDashboard = () => {
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [overviewStats, setOverviewStats] = useState<Stats | null>(null);

  const tabs = [
    "Overview",
    "Users",
    "Courses",
    "Batches",
    "Subjects",
    "Leaves",
    "Attendance",
  ];

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/fetchUserDetails`);
        const data = await response.json();
        if (response.status !== 200)
          toast.error(data.message || "Error while fetching user data");

        const overviewStats = await fetch(`/api/overviewStats`);
        const stats = await overviewStats.json();
        if (overviewStats.status !== 200 && overviewStats.status !== 403)
          toast.error(stats.message || "Error while fetching the stats");
        else if (overviewStats.status === 403) {
          return <AccessDenied />;
        }

        setOverviewStats(stats);
        setUserData(data.user);
      } catch (error) {
        toast.error("Error while fetching the data!");
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (loading) {
    return (
      <div className="">
        <LoadingSkeleton loadingText="Dashboard" />;
      </div>
    );
  }

  const chartData = {
    labels:
      overviewStats?.formattedStudentData.map((item) => item.course) || [],
    datasets: [
      {
        label: "Number of Students",
        data:
          overviewStats?.formattedStudentData.map((item) => item.students) ||
          [],
        backgroundColor: "black",
        borderColor: "rgba(0, 0, 0, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Students",
        },
      },
      x: {
        title: {
          display: true,
          text: "Courses",
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      <Navbar name={userData?.name} role={userData?.role} />
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
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-300 ease-in-out transform hover:scale-105 ${
                    activeTab === tab.toLowerCase()
                      ? "bg-gray-900 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                  onClick={() => {
                    setActiveTab(tab.toLowerCase());
                    toggleMobileMenu(); // Close menu after selection
                  }}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="hidden lg:flex flex-wrap justify-start gap-2 mb-8">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab.toLowerCase()}
                className="flex-grow basis-full sm:basis-1/2 md:basis-auto text-center"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab Content */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <StatCard
                title="Total Students"
                value={overviewStats?.studentCount || ""}
              />
              <StatCard
                title="Total Staff Members"
                value={overviewStats?.staffCount || ""}
              />
              <StatCard
                title="Total Courses"
                value={overviewStats?.totalCoursesCount || ""}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Students per Course</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-[300px] sm:h-[400px]">
                    <Bar data={chartData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <IndianCalendar />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <UsersTab />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Course Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CoursesTab />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="batches">
            <Card>
              <CardHeader>
                <CardTitle>Batch Management</CardTitle>
              </CardHeader>
              <CardContent>
                <BatchTab />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="subjects">
            <Card>
              <CardHeader>
                <CardTitle>Subject Management</CardTitle>
              </CardHeader>
              <CardContent>
                <SubjectsTab />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="leaves">
            <Card>
              <CardHeader>
                <CardTitle>Leave Management</CardTitle>
              </CardHeader>
              <CardContent>
                <LeavesTab />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Management</CardTitle>
              </CardHeader>
              <CardContent>
                <AttendanceTab />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <UserDetailsDialog
        open={showUserDetails}
        onOpenChange={setShowUserDetails}
        userId={""}
      />
    </div>
  );
};

export default AdminDashboard;
