"use client";

import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { useParams } from "next/navigation";
import AttendancePopup from "@/components/admin/AttendancePopUp";
import { toast } from "sonner";

const AttendanceTab = () => {
  const [subjectsData, setSubjectsData] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [clickedDate, setClickedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeAttendanceTab, setActiveAttendanceTab] = useState<'lecture' | 'lab'>('lecture');
  const { studentId } = useParams();

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/fetchRedirectAttendance?studentId=${studentId}`);
        if (!response.ok) throw new Error("Failed to fetch subjects and attendance");
        const data = await response.json();
        
        if (!data.success) throw new Error("Error in API response");

        setSubjectsData(data.data.subjects);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) fetchSubjects();
  }, [studentId]);

  useEffect(() => {
    if (!selectedSubject) return;

    const selectedData = subjectsData.find(subject => subject.subjectId === selectedSubject);
    if (selectedData) {
      const lectureAttendance = selectedData.attendanceRecords.filter(
        (        record: { type: string; }) => record.type === "LECTURE"
      );
      const labAttendance = selectedData.attendanceRecords.filter(
        (        record: { type: string; }) => record.type === "LAB"
      );

      setAttendanceData({
        ...selectedData,
        lectureAttendance,
        labAttendance,
      });
    }
  }, [selectedSubject, subjectsData]);

  const handlePrevMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const handleNextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleDateClick = (date: Date) => {
    setClickedDate(date);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setClickedDate(null);
  };

  const renderCalendar = (attendance: Array<{ date: Date; isPresent: boolean }>) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",
    ];

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const calendar = [];
    calendar.push(
      <div key="header-controls" className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-200">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div className="text-center font-bold text-lg">
          {months[currentMonth]} {currentYear}
        </div>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-200">
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    );

    calendar.push(
      <div key="days-header" className="grid grid-cols-7 gap-1 mb-2">
        {days.map(day => (
          <div key={day} className="text-center font-bold text-sm">
            {day}
          </div>
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

      const isToday =
        day === new Date().getDate() &&
        currentMonth === new Date().getMonth() &&
        currentYear === new Date().getFullYear();
      const cellClass = `h-10 flex flex-col items-center justify-center text-sm ${
        isToday ? "bg-blue-100 rounded" : ""
      } cursor-pointer hover:bg-gray-100`;

      cells.push(
        <div
          key={day}
          className={cellClass}
          onClick={() => handleDateClick(currentDate)}
        >
          <span>{day}</span>
          {attendanceRecord && <div className={dotClass}></div>}
        </div>
      );
    }

    calendar.push(
      <div key="calendar-days" className="grid grid-cols-7 gap-1">
        {cells}
      </div>
    );

    return calendar;
  };

  if (loading) return <LoadingSkeleton loadingText="Fetching attendance data..." />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6 text-black">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Attendance Overview</h2>
        <Calendar className="h-6 w-6 text-gray-500" />
      </div>

      <Select onValueChange={setSelectedSubject} value={selectedSubject}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a subject" />
        </SelectTrigger>
        <SelectContent>
          {subjectsData.map(subject => (
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
              <span className="text-sm font-medium">Overall Attendance</span>
              <div className="mt-2 text-2xl font-bold">
                {attendanceData.overallPercentage}%
              </div>
            </div>
            <div className="border p-4 rounded-lg">
              <span className="text-sm font-medium">Lecture Attendance</span>
              <div className="mt-2 text-2xl font-bold">
                {attendanceData.lecturePercentage}%
              </div>
            </div>
            <div className="border p-4 rounded-lg">
              <span className="text-sm font-medium">Lab Attendance</span>
              <div className="mt-2 text-2xl font-bold">
                {attendanceData.labPercentage}%
              </div>
            </div>
          </div>

          <Tabs
            defaultValue="lecture"
            value={activeAttendanceTab}
            onValueChange={value => setActiveAttendanceTab(value as 'lecture' | 'lab')}
          >
            <TabsList>
              <TabsTrigger value="lecture">Lecture Attendance</TabsTrigger>
              <TabsTrigger value="lab">Lab Attendance</TabsTrigger>
            </TabsList>
            <TabsContent value="lecture">
              {renderCalendar(attendanceData.lectureAttendance)}
            </TabsContent>
            <TabsContent value="lab">
              {renderCalendar(attendanceData.labAttendance)}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {isModalOpen && clickedDate && (
        <AttendancePopup
          isOpen={isModalOpen}
          onClose={closeModal}
          date={clickedDate}
          onSubmit={() => toast.success("Attendance updated successfully")}
        />
      )}
    </div>
  );
};

export default AttendanceTab;
