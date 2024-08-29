"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  LabelList,
  CartesianGrid,
  Legend,
  XAxis,
  YAxis,
} from "recharts";
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
import { NextResponse } from "next/server";
import LoadingSkeleton from "@/components/LoadingSkeleton";

const studentData = [
  { course: "BTech", students: 120 },
  { course: "MTech CS", students: 25 },
  { course: "MTech AI/ML", students: 20 },
  { course: "MSCDF", students: 30 },
];

const AdminDashboard = () => {
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        setUserData(data.user);
      } catch (error) {
        return NextResponse.json(
          { message: "Error while fetching user details" },
          { status: 500 }
        );
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar name={userData?.name} />
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
        {/* Small device mate view */}
        <div
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } lg:hidden bg-white rounded-md shadow-md mb-4`}
        >
          <ul className="py-2">
            {tabs.map((tab) => (
              <li key={tab} className="px-4 py-2">
                <button
                  className={`w-full text-left ${
                    activeTab === tab.toLowerCase()
                      ? "font-bold text-black"
                      : "text-gray-700 hover:text--600"
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

          <TabsContent value="overview">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <StatCard title="Total Students" value={255} />
              <StatCard title="Total Staff Members" value={42} />
              <StatCard title="Total Courses" value={4} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Students per Course</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-[300px] sm:h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart width={500} height={300} data={studentData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="course" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="students" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
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
      />
    </div>
  );
};

export default AdminDashboard;
