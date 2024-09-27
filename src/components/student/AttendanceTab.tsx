import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BookOpen, FlaskConical } from "lucide-react";

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent';
  type: 'lecture' | 'lab';
}

interface SubjectAttendance {
  name: string;
  records: AttendanceRecord[];
}

const AttendanceTab: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'lecture' | 'lab'>('lecture');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  // This is example data. In a real application, you'd fetch this data from an API.
  const subjects: SubjectAttendance[] = [
    {
      name: "Introduction to Computer Science",
      records: [
        { date: '2024-09-01', status: 'present', type: 'lecture' },
        { date: '2024-09-03', status: 'present', type: 'lab' },
        { date: '2024-09-05', status: 'absent', type: 'lecture' },
        // ... more records
      ]
    },
    {
      name: "Calculus I",
      records: [
        { date: '2024-09-02', status: 'present', type: 'lecture' },
        { date: '2024-09-04', status: 'present', type: 'lecture' },
        { date: '2024-09-06', status: 'absent', type: 'lab' },
        // ... more records
      ]
    },
    // ... more subjects
  ];

  const getAttendanceStats = (records: AttendanceRecord[]) => {
    const total = records.length;
    const present = records.filter(r => r.status === 'present').length;
    const percentage = (present / total) * 100;
    
    const lectures = records.filter(r => r.type === 'lecture');
    const labs = records.filter(r => r.type === 'lab');
    
    const lectureStats = {
      total: lectures.length,
      present: lectures.filter(r => r.status === 'present').length,
      percentage: (lectures.filter(r => r.status === 'present').length / lectures.length) * 100 || 0
    };
    
    const labStats = {
      total: labs.length,
      present: labs.filter(r => r.status === 'present').length,
      percentage: (labs.filter(r => r.status === 'present').length / labs.length) * 100 || 0
    };
    
    return { total, present, percentage, lectureStats, labStats };
  };

  const renderCalendar = (records: AttendanceRecord[], type: 'lecture' | 'lab') => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const filteredRecords = records.filter(r => r.type === type);
    
    const calendar = [];
    
    // Add month and year
    calendar.push(
      <div key="month-year" className="text-center font-bold text-lg mb-4">
        {months[currentMonth]} {currentYear}
      </div>
    );

    // Add day headers
    calendar.push(
      <div key="header" className="grid grid-cols-7 gap-1 mb-2">
        {days.map(day => (
          <div key={day} className="text-center font-bold text-sm">{day}</div>
        ))}
      </div>
    );

    let cells = [];
    // Add blank cells for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const record = filteredRecords.find(r => r.date === date);
      
      let dotClass = "w-2 h-2 rounded-full mx-auto mt-1";
      if (record) {
        dotClass += record.status === 'present' ? " bg-green-500" : " bg-red-500";
      }

      const isToday = day === currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear();
      const cellClass = `h-10 flex flex-col items-center justify-center text-sm ${isToday ? 'bg-blue-100 rounded' : ''}`;

      cells.push(
        <div key={day} className={cellClass}>
          <span>{day}</span>
          <div className={dotClass}></div>
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

  const selectedSubjectData = subjects.find(s => s.name === selectedSubject);

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
          {subjects.map(subject => (
            <SelectItem key={subject.name} value={subject.name}>
              {subject.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedSubjectData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Attendance</span>
                <Calendar className="h-4 w-4 text-gray-500" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">
                  {getAttendanceStats(selectedSubjectData.records).percentage.toFixed(2)}%
                </div>
                <p className="text-xs text-gray-500">
                  {getAttendanceStats(selectedSubjectData.records).present} / {getAttendanceStats(selectedSubjectData.records).total} classes
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
                  {getAttendanceStats(selectedSubjectData.records).lectureStats.percentage.toFixed(2)}%
                </div>
                <p className="text-xs text-gray-500">
                  {getAttendanceStats(selectedSubjectData.records).lectureStats.present} / {getAttendanceStats(selectedSubjectData.records).lectureStats.total} lectures
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
                  {getAttendanceStats(selectedSubjectData.records).labStats.percentage.toFixed(2)}%
                </div>
                <p className="text-xs text-gray-500">
                  {getAttendanceStats(selectedSubjectData.records).labStats.present} / {getAttendanceStats(selectedSubjectData.records).labStats.total} labs
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
                {renderCalendar(selectedSubjectData.records, 'lecture')}
              </TabsContent>
              <TabsContent value="lab">
                {renderCalendar(selectedSubjectData.records, 'lab')}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceTab;