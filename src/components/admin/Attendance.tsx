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
import { Input } from "@/components/ui/input";

// Extended mock data
const mockAttendanceData = [
  {
    id: 1,
    name: "John Doe",
    course: "BTech",
    batch: "2021-2025",
    subject: "Data Structures",
    totalClasses: 20,
    attendedClasses: 18,
    attendance: [
      { date: "2024-08-01", status: "Present" },
      { date: "2024-08-02", status: "Present" },
      // ... more dates
    ],
  },
  // ... more students
];

const AttendanceTab = () => {
  const [attendanceData, setAttendanceData] = useState(mockAttendanceData);
  const [selectedCourse, setSelectedCourse] = useState<string>("All");
  const [selectedBatch, setSelectedBatch] = useState<string>("All");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

  const filteredData = attendanceData.filter(
    (entry) =>
      (selectedCourse === "All" || entry.course === selectedCourse) &&
      (selectedBatch === "All" || entry.batch === selectedBatch) &&
      (selectedSubject === "All" || entry.subject === selectedSubject)
  );

  const handleAttendanceChange = (
    studentId: number,
    date: string,
    newStatus: string
  ) => {
    setAttendanceData((prevData) =>
      prevData.map((student) =>
        student.id === studentId
          ? {
              ...student,
              attendance: student.attendance.map((record) =>
                record.date === date ? { ...record, status: newStatus } : record
              ),
              attendedClasses:
                newStatus === "Present"
                  ? student.attendedClasses + 1
                  : student.attendedClasses - 1,
            }
          : student
      )
    );
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Select onValueChange={setSelectedCourse} value={selectedCourse}>
          <SelectTrigger className="w-[200px]">
            {selectedCourse || "Select Course"}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Courses</SelectItem>
            <SelectItem value="BTech">BTech</SelectItem>
            <SelectItem value="MTech CS">MTech CS</SelectItem>
            <SelectItem value="MTech AI/ML">MTech AI/ML</SelectItem>
            <SelectItem value="MSCDF">MSCDF</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedBatch} value={selectedBatch}>
          <SelectTrigger className="w-[200px]">
            {selectedBatch || "Select Batch"}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Batches</SelectItem>
            <SelectItem value="2021-2025">2021-2025</SelectItem>
            <SelectItem value="2022-2026">2022-2026</SelectItem>
            {/* Add more batch options */}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedSubject} value={selectedSubject}>
          <SelectTrigger className="w-[200px]">
            {selectedSubject || "Select Subject"}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Subjects</SelectItem>
            <SelectItem value="Data Structures">Data Structures</SelectItem>
            <SelectItem value="Machine Learning">Machine Learning</SelectItem>
            {/* Add more subject options */}
          </SelectContent>
        </Select>

        <Button
          onClick={() => {
            setSelectedCourse("All");
            setSelectedBatch("All");
            setSelectedSubject("All");
          }}
        >
          Reset Filters
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Attendance</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.name}</TableCell>
              <TableCell>{entry.course}</TableCell>
              <TableCell>{entry.batch}</TableCell>
              <TableCell>{entry.subject}</TableCell>
              <TableCell>{`${entry.attendedClasses}/${entry.totalClasses}`}</TableCell>
              <TableCell>
                <Button onClick={() => setSelectedStudent(entry.id)}>
                  View/Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedStudent && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Detailed Attendance</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData
                .find((student) => student.id === selectedStudent)
                ?.attendance.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.status}</TableCell>
                    <TableCell>
                      <Select
                        onValueChange={(newStatus) =>
                          handleAttendanceChange(
                            selectedStudent,
                            record.date,
                            newStatus
                          )
                        }
                        value={record.status}
                      >
                        <SelectTrigger className="w-[120px]">
                          {record.status}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Present">Present</SelectItem>
                          <SelectItem value="Absent">Absent</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AttendanceTab;
