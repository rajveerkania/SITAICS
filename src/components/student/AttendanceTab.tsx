import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BookOpen, FlaskConical } from "lucide-react";
import LoadingSkeleton from "../LoadingSkeleton";

interface Staff {
  id: string;
  name: string;
  email: string;
}

interface Subject {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  semester: number;
  staff: Staff[] | "NA";
}

interface SubjectsData {
  studentId: string;
  courseName: string;
  batchName: string;
  subjects: Subject[];
}

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent';
  type: 'lecture' | 'lab';
}

interface AttendanceProps {
  studentId: string;
}

const AttendanceTab: React.FC<AttendanceProps> = ({ studentId }) => {
  const [subjectsData, setSubjectsData] = useState<SubjectsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'lecture' | 'lab'>('lecture');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(
          `/api/student/fetchSubjects?studentId=${studentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch subjects");
        }
        const data: SubjectsData = await response.json();
        if (data.subjects.length === 0) {
          setError("No subjects found");
        }
        setSubjectsData(data);
      } catch (err) {
        setError("Error fetching subjects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [studentId]);

  if (loading) return <LoadingSkeleton loadingText="subjects" />;
  if (error) return <div>{error}</div>;
  if (!subjectsData) return null;


  // Example attendance records - in a real app, you'd fetch this from an API
  const attendanceRecords: Record<string, AttendanceRecord[]> = {
    "subject-1": [
      { date: '2024-09-01', status: 'present', type: 'lecture' },
      { date: '2024-09-03', status: 'present', type: 'lab' },
      { date: '2024-09-05', status: 'absent', type: 'lecture' },
    ],
    // Add more subjects as needed
  };

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

  if (loading) return <LoadingSkeleton loadingText="attendance data" />;
  if (error) return <div>{error}</div>;
  if (!subjectsData) return null;

  const selectedSubjectRecords = selectedSubject ? (attendanceRecords[selectedSubject] || []) : [];

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

      {selectedSubject && selectedSubjectRecords.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Attendance</span>
                <Calendar className="h-4 w-4 text-gray-500" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">
                  {getAttendanceStats(selectedSubjectRecords).percentage.toFixed(2)}%
                </div>
                <p className="text-xs text-gray-500">
                  {getAttendanceStats(selectedSubjectRecords).present} / {getAttendanceStats(selectedSubjectRecords).total} classes
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
                  {getAttendanceStats(selectedSubjectRecords).lectureStats.percentage.toFixed(2)}%
                </div>
                <p className="text-xs text-gray-500">
                  {getAttendanceStats(selectedSubjectRecords).lectureStats.present} / {getAttendanceStats(selectedSubjectRecords).lectureStats.total} lectures
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
                  {getAttendanceStats(selectedSubjectRecords).labStats.percentage.toFixed(2)}%
                </div>
                <p className="text-xs text-gray-500">
                  {getAttendanceStats(selectedSubjectRecords).labStats.present} / {getAttendanceStats(selectedSubjectRecords).labStats.total} labs
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
                {renderCalendar(selectedSubjectRecords, 'lecture')}
              </TabsContent>
              <TabsContent value="lab">
                {renderCalendar(selectedSubjectRecords, 'lab')}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceTab;