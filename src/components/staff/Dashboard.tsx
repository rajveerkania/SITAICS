import React from "react";
import { IndianCalendar } from "../IndianCalendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "../StatCard";

const studentData = [
  { course: "BTech", students: 120 },
  { course: "MTech CS", students: 25 },
  { course: "MTech AI/ML", students: 20 },
  { course: "MSCDF", students: 30 },
];

const Dashboard: React.FC = () => {
  return (
    <>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      <StatCard title="Total Subjects" value={3} />
      <StatCard title="Total Students" value={42} />
      <StatCard title="Approved Leaves" value={4} />
    </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="font-bold text-lg mb-2">Today's Schedule</h3>
            <ul className="space-y-2">
              <li>09:00 AM - Data Structures (Room 101)</li>
              <li>11:00 AM - Database Management (Lab 2)</li>
              <li>02:00 PM - Algorithms (Room 203)</li>
            </ul>
          </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="font-bold text-lg mb-2">Calendar</h3>
          <IndianCalendar />
        </div>
      </div>
      <br />
    </>
  );
};

export default Dashboard;