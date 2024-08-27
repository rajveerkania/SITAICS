"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  LabelList,
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

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/fetchUserDetails`
        );
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
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="flex flex-wrap justify-start gap-2 mb-8">
            <TabsTrigger
              value="overview"
              className="flex-grow basis-full sm:basis-1/2 md:basis-auto text-center"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="flex-grow basis-full sm:basis-1/2 md:basis-auto text-center"
            >
              Users
            </TabsTrigger>
            <TabsTrigger
              value="batches"
              className="flex-grow basis-full sm:basis-1/2 md:basis-auto text-center"
            >
              Batches
            </TabsTrigger>
            <TabsTrigger
              value="courses"
              className="flex-grow basis-full sm:basis-1/2 md:basis-auto text-center"
            >
              Courses
            </TabsTrigger>
            <TabsTrigger
              value="subjects"
              className="flex-grow basis-full sm:basis-1/2 md:basis-auto text-center"
            >
              Subjects
            </TabsTrigger>
            <TabsTrigger
              value="leaves"
              className="flex-grow basis-full sm:basis-1/2 md:basis-auto text-center"
            >
              Leaves
            </TabsTrigger>
            <TabsTrigger
              value="attendance"
              className="flex-grow basis-full sm:basis-1/2 md:basis-auto text-center"
            >
              Attendance
            </TabsTrigger>
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
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={studentData}>
                      <Bar dataKey="students" fill="#000">
                        <LabelList dataKey="students" position="top" />
                      </Bar>
                      <Tooltip />
                    </BarChart>
                  </ResponsiveContainer>
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
