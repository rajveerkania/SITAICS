// components/admin/AttendanceTab.tsx
"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";

const mockAttendanceData = [
  { id: 1, name: "John Doe", course: "BTech", date: "2024-08-01", status: "Present" },
  { id: 2, name: "Jane Smith", course: "MTech CS", date: "2024-08-01", status: "Absent" },
  { id: 3, name: "Bob Johnson", course: "MTech AI/ML", date: "2024-08-01", status: "Present" },
  // Add more mock data as needed
];

const AttendanceTab = () => {
  const [attendanceData, setAttendanceData] = useState(mockAttendanceData);
  const [selectedCourse, setSelectedCourse] = useState<string>("All");

  const filteredData = attendanceData.filter(
    (entry) => selectedCourse === "All" || entry.course === selectedCourse
  );

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col md:flex-row items-center">
          <label htmlFor="course-select" className="mb-2 md:mb-0 md:mr-2">
            Filter by Course
          </label>
          <Select
            onValueChange={setSelectedCourse}
            value={selectedCourse}  // Use `value` for controlled input
          >
            <SelectTrigger className="w-full md:w-auto">
              {selectedCourse}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Courses</SelectItem>
              <SelectItem value="BTech">BTech</SelectItem>
              <SelectItem value="MTech CS">MTech CS</SelectItem>
              <SelectItem value="MTech AI/ML">MTech AI/ML</SelectItem>
              <SelectItem value="MSCDF">MSCDF</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={() => setSelectedCourse("All")}
          className="mt-2 md:mt-0"
        >
          Reset Filters
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.name}</TableCell>
              <TableCell>{entry.course}</TableCell>
              <TableCell>{entry.date}</TableCell>
              <TableCell>{entry.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceTab;
