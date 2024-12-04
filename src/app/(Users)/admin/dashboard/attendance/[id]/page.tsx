"use client"
import React, { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Calendar, 
  BookOpen, 
  FlaskConical, 
  Users, 
  BarChart 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { AttendanceType } from '@prisma/client';

interface AttendanceStats {
  totalLectures: number;
  totalLabs: number;
  lecturesAttended: number;
  labsAttended: number;
  lecturePercentage: number;
  labPercentage: number;
  overallPercentage: number;
  studentName?: string;
  subjectName?: string;
  batchName?: string;
  studentDetails?: {
    studentId: string;
    name: string;
    enrollmentNumber: string;
  };
  attendanceRecords: Array<{
    date: Date;
    type: AttendanceType;
    isPresent: boolean;
    studentName?: string;
    studentId?: string;
    enrollmentNumber?: string;
  }>;
}

interface BatchData {
  batchId: string;
  batchName: string;
}

interface SubjectData {
  subjectId: string;
  subjectName: string;
}

const AdminAttendanceView: React.FC = () => {
  // State for dropdowns and filters
  const [batches, setBatches] = useState<BatchData[]>([]);
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [searchStudent, setSearchStudent] = useState<string>('');

  // State for attendance data
  const [attendanceData, setAttendanceData] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State for calendar view
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedType, setSelectedType] = useState<'lecture' | 'lab'>('lecture');

  // Fetch batches and subjects on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch batches
        const batchResponse = await fetch('/api/fetchBatches');
        const batchData = await batchResponse.json();
        setBatches(batchData.data);

        // Fetch subjects
        const subjectResponse = await fetch('/api/fetchBatchSubjects');
        const subjectData = await subjectResponse.json();
        setSubjects(subjectData.data);
      } catch (err) {
        setError('Failed to load initial data');
      }
    };

    fetchInitialData();
  }, []);

  // Fetch attendance data
  const fetchAttendanceData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Construct query parameters
      const params = new URLSearchParams();
      if (selectedBatch) params.append('batchId', selectedBatch);
      if (selectedSubject) params.append('subjectId', selectedSubject);
      if (searchStudent) params.append('studentId', searchStudent);

      const response = await fetch(`/api/fetchRedirectAttendance?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setAttendanceData(result.data);
      } else {
        setError(result.message || 'Failed to fetch attendance data');
      }
    } catch (err) {
      setError('An error occurred while fetching attendance data');
    } finally {
      setLoading(false);
    }
  };

  // Render calendar function (similar to student view)
  const renderCalendar = (attendance: Array<{ 
    date: Date; 
    isPresent: boolean; 
    studentName?: string;
    enrollmentNumber?: string;
  }>) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const calendar = [];
    calendar.push(
      <div key="month-year" className="text-center font-bold text-lg mb-4">
        {months[currentMonth]} {currentYear}
      </div>
    );

    calendar.push(
      <div key="header" className="grid grid-cols-7 gap-1 mb-2">
        {days.map(day => (
          <div key={day} className="text-center font-bold text-sm">{day}</div>
        ))}
      </div>
    );

    let cells = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentYear, currentMonth, day);
      const attendanceRecords = attendance.filter(
        record => new Date(record.date).toDateString() === currentDate.toDateString()
      );

      let dotClass = "w-2 h-2 rounded-full mx-auto mt-1";
      const isPresent = attendanceRecords.some(record => record.isPresent);
      dotClass += isPresent ? " bg-green-500" : " bg-red-500";

      const isToday = day === new Date().getDate() &&
                      currentMonth === new Date().getMonth() &&
                      currentYear === new Date().getFullYear();

      const cellClass = `h-10 flex flex-col items-center justify-center text-sm ${isToday ? 'bg-blue-100 rounded' : ''}`;

      cells.push(
        <div key={day} className={cellClass}>
          <span>{day}</span>
          {attendanceRecords.length > 0 && <div className={dotClass} title={
            attendanceRecords.map(r => 
              `${r.studentName} (${r.enrollmentNumber}): ${r.isPresent ? 'Present' : 'Absent'}`
            ).join('\n')
          }></div>}
        </div>
      );
    }

    calendar.push(
      <div key="days" className="grid grid-cols-7 gap-1">
        {cells}
      </div>
    );

    return calendar;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center">
          <BarChart className="mr-3 h-8 w-8 text-primary" />
          Attendance Management
        </h1>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select onValueChange={setSelectedBatch}>
          <SelectTrigger>
            <SelectValue placeholder="Select Batch" />
          </SelectTrigger>
          <SelectContent>
  {batches && batches.length > 0 ? (
    batches.map(batch => (
      <SelectItem key={batch.batchId} value={batch.batchId}>
        {batch.batchName}
      </SelectItem>
    ))
  ) : (
    <div className="p-2 text-gray-500">No batches available</div>
  )}
    </SelectContent>

        </Select>

        <Select onValueChange={setSelectedSubject}>
          <SelectTrigger>
            <SelectValue placeholder="Select Subject" />
          </SelectTrigger>
          <SelectContent>
  {subjects && subjects.length > 0 ? (
    subjects.map(subject => (
      <SelectItem key={subject.subjectId} value={subject.subjectId}>
        {subject.subjectName}
      </SelectItem>
    ))
  ) : (
    <div className="p-2 text-gray-500">No subjects available</div>
  )}
</SelectContent>
        </Select>

        <div className="flex space-x-2">
          <Input 
            placeholder="Search Student ID" 
            value={searchStudent}
            onChange={(e) => setSearchStudent(e.target.value)}
          />
          <Button onClick={fetchAttendanceData}>
            Search
          </Button>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && <LoadingSkeleton loadingText="Loading attendance data" />}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Attendance Statistics */}
      {attendanceData && (
        <div className="space-y-6">
          {/* Context Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">
              Attendance Context
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {attendanceData.batchName && (
                <div>
                  <strong>Batch:</strong> {attendanceData.batchName}
                </div>
              )}
              {attendanceData.subjectName && (
                <div>
                  <strong>Subject:</strong> {attendanceData.subjectName}
                </div>
              )}
              {attendanceData.studentDetails && (
                <div>
                  <strong>Student:</strong> {attendanceData.studentDetails.name} 
                  {' '}({attendanceData.studentDetails.enrollmentNumber})
                </div>
              )}
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Attendance</span>
                <Calendar className="h-4 w-4 text-gray-500" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">
                  {attendanceData.overallPercentage}%
                </div>
                <p className="text-xs text-gray-500">
                  Combined lectures and labs
                </p>
              </div>
            </div>
            <div className="border p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Lecture Attendance</span>
                <BookOpen className="h-4 w-4 text-gray-500" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">
                  {attendanceData.lecturePercentage}%
                </div>
                <p className="text-xs text-gray-500">
                  {attendanceData.lecturesAttended} / {attendanceData.totalLectures} lectures
                </p>
              </div>
            </div>
            <div className="border p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Lab Attendance</span>
                <FlaskConical className="h-4 w-4 text-gray-500" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">
                  {attendanceData.labPercentage}%
                </div>
                <p className="text-xs text-gray-500">
                  {attendanceData.labsAttended} / {attendanceData.totalLabs} labs
                </p>
              </div>
            </div>
          </div>

          {/* Attendance Calendar */}
          <div className="border rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4">Attendance Calendar</h3>
            <Tabs defaultValue="lecture" onValueChange={(value) => setSelectedType(value as 'lecture' | 'lab')}>
              <TabsList className="mb-4">
                <TabsTrigger value="lecture">Lectures</TabsTrigger>
                <TabsTrigger value="lab">Labs</TabsTrigger>
              </TabsList>
              <TabsContent value="lecture">
                {renderCalendar(
                  attendanceData.attendanceRecords.filter(
                    record => record.type === AttendanceType.LECTURE
                  )
                )}
              </TabsContent>
              <TabsContent value="lab">
                {renderCalendar(
                  attendanceData.attendanceRecords.filter(
                    record => record.type === AttendanceType.LAB
                  )
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAttendanceView;
