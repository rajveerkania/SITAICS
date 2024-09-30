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

// Mock attendance data
const mockAttendanceData = [
  {
    id: 1,
    name: "John Doe",
    course: "BTech",
    batch: "2021-2025",
    subject: "Data Structures",
    attendance: {},
  },
  // More student data...
];

// Mock attendance records
const mockAttendanceRecords = [
  {
    id: 1,
    name: "John Doe",
    course: "BTech",
    batch: "2021-2025",
    subject: "Data Structures",
    attendance: {
      "2024-09-01": "Present",
      "2024-09-02": "Absent",
      "2024-09-03": "Present",
    },
  },
  // More record data...
];

// Mark Attendance Tab
const MarkAttendanceTab = ({ attendanceData, setAttendanceData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleAttendanceChange = (studentId: number, status: string) => {
    setAttendanceData((prevData: any[]) =>
      prevData.map((student: { id: number; attendance: any; }) => {
        if (student.id === studentId) {
          const newAttendance = {
            ...student.attendance,
            [parseDate(selectedDate)]: status,
          };
          return { ...student, attendance: newAttendance };
        }
        return student;
      })
    );
  };

  const handleSubmitAttendance = () => {
    console.log("Submitting attendance for date:", selectedDate);
    console.log("Attendance data:", attendanceData);
    setSelectedDate("");
  };

  const filteredData = attendanceData.filter((entry: { name: string; course: string; batch: string; subject: string; }) => {
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
          <Select onValueChange={setSelectedCourse} value={selectedCourse || ""}>
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
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedSubject} value={selectedSubject || ""}>
            <SelectTrigger className="w-[200px]">
              {selectedSubject || "Select Subject"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Subjects</SelectItem>
              <SelectItem value="Data Structures">Data Structures</SelectItem>
              <SelectItem value="Machine Learning">Machine Learning</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="text"
            value={selectedDate}
            onChange={handleDateChange}
            placeholder="Date (dd/mm/yy)"
            className="px-4 py-2 border border-gray-300 rounded-md mb-2 sm:mb-0 sm:w-32"
          />
        </div>
        <div className="flex space-x-2">
          <Button
            className="bg-black text-white hover:bg-gray-800"
            onClick={handleSubmitAttendance}
            disabled={!selectedDate}
          >
            Submit Attendance
          </Button>
          <Button
            variant="outline"
            className="bg-gray-200 text-black hover:bg-gray-300"
            onClick={() => {
              setSearchQuery("");
              setSelectedCourse(null);
              setSelectedBatch(null);
              setSelectedSubject(null);
              setSelectedDate("");
            }}
          >
            Clear
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Attendance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((entry: { id: React.Key | null | undefined; name: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; course: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; batch: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; subject: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; attendance: { [x: string]: any; }; }) => (
            <TableRow key={entry.id} className="hover:bg-gray-100 transition-all">
              <TableCell>{entry.name}</TableCell>
              <TableCell>{entry.course}</TableCell>
              <TableCell>{entry.batch}</TableCell>
              <TableCell>{entry.subject}</TableCell>
              <TableCell>
                <Select
                  onValueChange={(status) => handleAttendanceChange(entry.id, status)}
                  value={entry.attendance[parseDate(selectedDate)] || ""}
                  disabled={!selectedDate}
                >
                  <SelectTrigger className="w-[120px]">
                    {entry.attendance[parseDate(selectedDate)] || "Mark"}
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
  );
};
 
const RecordsTab = ({ attendanceRecords }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredRecords = attendanceRecords.filter((record: { name: string; course: string; batch: string; subject: string; }) => {
    return (
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCourse === null || record.course === selectedCourse) &&
      (selectedBatch === null || record.batch === selectedBatch) &&
      (selectedSubject === null || record.subject === selectedSubject)
    );
  });

  const calculateAttendance = (attendance: { [s: string]: unknown; } | ArrayLike<unknown>) => {
    const totalDays = Object.keys(attendance).length;
    const presentDays = Object.values(attendance).filter(status => status === "Present").length;
    return `${presentDays} present out of ${totalDays}`;
  };

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
          <Select onValueChange={setSelectedCourse} value={selectedCourse || ""}>
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
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedSubject} value={selectedSubject || ""}>
            <SelectTrigger className="w-[200px]">
              {selectedSubject || "Select Subject"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Subjects</SelectItem>
              <SelectItem value="Data Structures">Data Structures</SelectItem>
              <SelectItem value="Machine Learning">Machine Learning</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Attendance Record</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRecords.map((record: { id: React.Key | null | undefined; name: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; course: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; batch: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; subject: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; attendance: any; }) => (
            <TableRow key={record.id} className="hover:bg-gray-100 transition-all">
              <TableCell>{record.name}</TableCell>
              <TableCell>{record.course}</TableCell>
              <TableCell>{record.batch}</TableCell>
              <TableCell>{record.subject}</TableCell>
              <TableCell>
                {calculateAttendance(record.attendance)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const AttendanceTab = () => {
  const [attendanceData, setAttendanceData] = useState(mockAttendanceData);
  const [attendanceRecords, setAttendanceRecords] = useState(mockAttendanceRecords);
  const [activeTab, setActiveTab] = useState('mark');

  return (
    <div className="p-15 mx-auto max-w-10xl">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Attendance Management</h2>

        <div className="mb-4">
          <Button
            onClick={() => setActiveTab('mark')}
            className={`mr-2 ${activeTab === 'mark' ? 'bg-black text-white' : 'bg-gray-200 text-black'} py-2 px-4 rounded-lg transition-transform transform hover:scale-105`}
          >
            Mark Attendance
          </Button>
          <Button
            onClick={() => setActiveTab('records')}
            className={`${activeTab === 'records' ? 'bg-black text-white' : 'bg-gray-200 text-black'} py-2 px-4 rounded-lg transition-transform transform hover:scale-105`}
          >
            Records
          </Button>
        </div>

        {activeTab === 'mark' && (
          <MarkAttendanceTab
            attendanceData={attendanceData}
            setAttendanceData={setAttendanceData}
          />
        )}
        {activeTab === 'records' && (
          <RecordsTab attendanceRecords={attendanceRecords} />
        )}
      </div>
    </div>
  );
};

export default AttendanceTab;

const parseDate = (date: string) => {
  const parts = date.split("/");
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};
