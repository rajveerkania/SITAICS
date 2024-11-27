import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BookOpen, FlaskConical } from "lucide-react";
import LoadingSkeleton from "../LoadingSkeleton";
import { Subject } from '@prisma/client';

interface AttendanceStats {
  totalLectures: number;
  totalLabs: number;
  lecturesAttended: number;
  labsAttended: number;
  lecturePercentage: number;
  labPercentage: number;
  overallPercentage: number;
  lectureAttendance: Array<{
    date: Date;
    isPresent: boolean;
  }>;
  labAttendance: Array<{
    date: Date;
    isPresent: boolean;
  }>;
}

interface AttendanceProps {
  studentId: string;
}
interface SubjectsData {
  studentId: string;
  courseName: string;
  batchName: string;
  subjects: Subject[];
}



const AttendanceTab: React.FC<AttendanceProps> = ({ studentId }) => {
  const [subjectsData, setSubjectsData] = useState<SubjectsData | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'lecture' | 'lab'>('lecture');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(`/api/student/fetchSubjects?studentId=${studentId}`);
        if (!response.ok) throw new Error("Failed to fetch subjects");
        const data = await response.json();
        setSubjectsData(data);
      } catch (err) {
        setError("Error fetching subjects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [studentId]);

  // Fetch attendance data when subject is selected
  useEffect(() => {
    if (!selectedSubject) return;

    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/student/fetchAttendance?studentId=${studentId}&subjectId=${selectedSubject}`
        );
        if (!response.ok) throw new Error("Failed to fetch attendance");
        const { data } = await response.json();
        setAttendanceData(data);
      } catch (err) {
        setError("Error fetching attendance data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [studentId, selectedSubject]);

  const renderCalendar = (attendance: Array<{ date: Date; isPresent: boolean }>) => {
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
      const attendanceRecord = attendance.find(
        record => new Date(record.date).toDateString() === currentDate.toDateString()
      );
      
      let dotClass = "w-2 h-2 rounded-full mx-auto mt-1";
      if (attendanceRecord) {
        dotClass += attendanceRecord.isPresent ? " bg-green-500" : " bg-red-500";
      }

      const isToday = day === new Date().getDate() && 
                      currentMonth === new Date().getMonth() && 
                      currentYear === new Date().getFullYear();
      const cellClass = `h-10 flex flex-col items-center justify-center text-sm ${isToday ? 'bg-blue-100 rounded' : ''}`;

      cells.push(
        <div key={day} className={cellClass}>
          <span>{day}</span>
          {attendanceRecord && <div className={dotClass}></div>}
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

  if (loading && !subjectsData) return <LoadingSkeleton loadingText="subjects" />;
  if (error) return <div>{error}</div>;
  if (!subjectsData) return null;

  return (
    <div className="space-y-6 text-black">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Attendance Overview</h2>
        <Calendar className="h-6 w-6 text-gray-500" />
      </div>
      
      <Select onValueChange={setSelectedSubject}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a subject" />
        </SelectTrigger>
        <SelectContent>
          {subjectsData.subjects.map(subject => (
            <SelectItem key={subject.subjectId} value={subject.subjectId}>
              {subject.subjectName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedSubject && attendanceData && (
        <div className="space-y-6">
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

          <div className="border rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4">Attendance Calendar</h3>
            <Tabs defaultValue="lecture" onValueChange={(value) => setSelectedType(value as 'lecture' | 'lab')}>
              <TabsList className="mb-4">
                <TabsTrigger value="lecture">Lectures</TabsTrigger>
                <TabsTrigger value="lab">Labs</TabsTrigger>
              </TabsList>
              <TabsContent value="lecture">
                {renderCalendar(attendanceData.lectureAttendance)}
              </TabsContent>
              <TabsContent value="lab">
                {renderCalendar(attendanceData.labAttendance)}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceTab;