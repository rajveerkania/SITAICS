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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Mock attendance data
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
      { date: "2024-08-02", status: "Absent" },
      // More dates...
    ],
  },
  // More student data...
];

const AttendanceTab = () => {
  const [attendanceData, setAttendanceData] = useState(mockAttendanceData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleEditClick = (student: any) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleAttendanceChange = (index: number, newStatus: string) => {
    if (selectedStudent) {
      const updatedAttendance = [...selectedStudent.attendance];
      updatedAttendance[index].status = newStatus;
      setSelectedStudent({ ...selectedStudent, attendance: updatedAttendance });
    }
  };

  const handleSaveChanges = () => {
    setAttendanceData((prevData) =>
      prevData.map((entry) =>
        entry.id === selectedStudent.id ? selectedStudent : entry
      )
    );
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const filteredData = attendanceData.filter((entry) => {
    return (
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCourse === null || entry.course === selectedCourse) &&
      (selectedBatch === null || entry.batch === selectedBatch) &&
      (selectedSubject === null || entry.subject === selectedSubject)
    );
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <div className="flex flex-col sm:flex-row sm:space-x-2 mb-4 sm:mb-0">
          <Input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name"
            className="px-4 py-2 border border-gray-300 rounded-md mb-2 sm:mb-0 sm:w-64"
          />
          <Select
            onValueChange={setSelectedCourse}
            value={selectedCourse || ""}
          >
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
          <Select onValueChange={setSelectedBatch} value={selectedBatch || ""}>
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
          <Select
            onValueChange={setSelectedSubject}
            value={selectedSubject || ""}
          >
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
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchQuery("");
            setSelectedCourse(null);
            setSelectedBatch(null);
            setSelectedSubject(null);
          }}
          className="w-full sm:w-auto mt-2 sm:mt-0"
        >
          Clear
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
            <TableRow
              key={entry.id}
              className="hover:bg-gray-100 transition-all"
            >
              <TableCell>{entry.name}</TableCell>
              <TableCell>{entry.course}</TableCell>
              <TableCell>{entry.batch}</TableCell>
              <TableCell>{entry.subject}</TableCell>
              <TableCell>{`${entry.attendedClasses}/${entry.totalClasses}`}</TableCell>
              <TableCell>
                <Button onClick={() => handleEditClick(entry)}>
                  View/Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Attendance Modal */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Edit Attendance for {selectedStudent.name}
              </DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedStudent.attendance.map(
                    (record: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.status}</TableCell>
                        <TableCell>
                          <Select
                            value={record.status}
                            onValueChange={(newStatus) =>
                              handleAttendanceChange(index, newStatus)
                            }
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
                    )
                  )}
                </TableBody>
              </Table>
              <DialogFooter className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button className="ml-2" onClick={handleSaveChanges}>
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AttendanceTab;
