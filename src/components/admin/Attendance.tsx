"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
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
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";

interface AttendanceData {
  courseId: string;
  courseName: string;
  batches: {
    batchId: string;
    batchName: string;
    subjects: {
      subjectId: string;
      subjectName: string;
      attendance: {
        totalLectures: number;
        totalLabs: number;
        averageLectureAttendance: number;
        averageLabAttendance: number;
        averageOverallAttendance: number;
        studentDetails: StudentDetail[];
        lectureDates: Date[];
        labDates: Date[];
      };
    }[];
  }[];
}

interface StudentDetail {
  studentId: string;
  name: string;
  email: string;
  enrollmentNumber: string;
  totalLecturesTaken: number;
  lecturesAttended: number;
  lecturePercentage: number;
  totalLabsTaken: number;
  labsAttended: number;
  labPercentage: number;
  overallAttendancePercentage: number;
}

interface AttendanceRecord {
  id: string;
  date: Date;
  isPresent: boolean;
  type: 'LECTURE' | 'LAB';
}

const AttendanceTab = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  // Derived state for dropdowns
  const [availableBatches, setAvailableBatches] = useState<{ id: string; name: string }[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<{ id: string; name: string }[]>([]);

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/fetchAttendanceForAdmin');
        if (!response.ok) {
          throw new Error('Failed to fetch attendance data');
        }
        const data = await response.json();
        if (data.success) {
          setAttendanceData(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch attendance data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  // Update available batches when course changes
  useEffect(() => {
    if (selectedCourse && attendanceData.length > 0) {
      const course = attendanceData.find(c => c.courseId === selectedCourse);
      if (course) {
        setAvailableBatches(course.batches.map(b => ({
          id: b.batchId,
          name: b.batchName
        })));
      }
      setSelectedBatch("");
      setSelectedSubject("");
    }
  }, [selectedCourse, attendanceData]);

  // Update available subjects when batch changes
  useEffect(() => {
    if (selectedBatch && selectedCourse && attendanceData.length > 0) {
      const course = attendanceData.find(c => c.courseId === selectedCourse);
      const batch = course?.batches.find(b => b.batchId === selectedBatch);
      if (batch) {
        setAvailableSubjects(batch.subjects.map(s => ({
          id: s.subjectId,
          name: s.subjectName
        })));
      }
      setSelectedSubject("");
    }
  }, [selectedBatch, selectedCourse, attendanceData]);

  const fetchAttendanceRecords = async (studentId: string, subjectId: string, date: Date) => {
    try {
      const response = await fetch(`/api/fetchAttendanceForAdmin?studentId=${studentId}&subjectId=${subjectId}&date=${date.toISOString()}`);
      if (!response.ok) throw new Error('Failed to fetch attendance records');
      const data = await response.json();
      setAttendanceRecords(data.records);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      toast.error('Failed to fetch attendance records');
    }
  };

  const updateAttendance = async (attendanceId: string, isPresent: boolean) => {
    try {
      const response = await fetch('/api/updateAttendance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attendanceId,
          isPresent,
        }),
      });

      if (!response.ok) throw new Error('Failed to update attendance');
      
      toast.success('Attendance updated successfully');

      // Refresh the attendance records
      if (selectedStudent && selectedDate) {
        fetchAttendanceRecords(selectedStudent.studentId, selectedSubject, selectedDate);
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast.error('Failed to update attendance');
    }
  };

  // Get filtered student data
  const getFilteredStudents = () => {
    if (!selectedCourse || !selectedBatch || !selectedSubject) {
      return [];
    }

    const course = attendanceData.find(c => c.courseId === selectedCourse);
    const batch = course?.batches.find(b => b.batchId === selectedBatch);
    const subject = batch?.subjects.find(s => s.subjectId === selectedSubject);
    
    if (!subject?.attendance.studentDetails) {
      return [];
    }

    return subject.attendance.studentDetails.filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.enrollmentNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getDistinctDates = () => {
    const course = attendanceData.find(c => c.courseId === selectedCourse);
    const batch = course?.batches.find(b => b.batchId === selectedBatch);
    const subject = batch?.subjects.find(s => s.subjectId === selectedSubject);
    
    if (!subject) return [];
    
    const allDates = [
      ...subject.attendance.lectureDates.map(date => ({
        date: new Date(date),
        type: 'LECTURE' as const
      })),
      ...subject.attendance.labDates.map(date => ({
        date: new Date(date),
        type: 'LAB' as const
      }))
    ];

    return allDates.sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const handleViewDetails = (student: StudentDetail) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  // Enhanced view details dialog content
  const renderDetailedAttendance = () => {
    if (!selectedStudent) return null;

    const distinctDates = getDistinctDates();

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-4">Select Date</h3>
          <div className="rounded-md border p-4">
          <Calendar
  mode="single"
  selected={selectedDate || undefined}
  onSelect={(date: Date | undefined) => {
    setSelectedDate(date ?? null);
  }}
  disabled={(date) => 
    !distinctDates.some(d => 
      d.date.toDateString() === date.toDateString()
    )
  }
  className="rounded-md border"
/>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-4">Attendance Records</h3>
          {selectedDate && (
            <div className="space-y-4">
              {attendanceRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{record.type}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(record.date), 'PPP')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">
                      {record.isPresent ? 'Present' : 'Absent'}
                    </span>
                    <Switch
                      checked={record.isPresent}
                      onCheckedChange={(checked) => updateAttendance(record.id, checked)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Update useEffect to fetch attendance records when date is selected
  useEffect(() => {
    if (selectedStudent && selectedDate && selectedSubject) {
      fetchAttendanceRecords(selectedStudent.studentId, selectedSubject, selectedDate);
    }
  }, [selectedStudent, selectedDate, selectedSubject]);

  if (loading) {
    return <div className="p-4">Loading attendance data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
        <div className="flex flex-col sm:flex-row sm:space-x-2 mb-4 sm:mb-0 gap-2">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or enrollment number"
            className="sm:w-64"
          />
          
          <Select
            value={selectedCourse}
            onValueChange={setSelectedCourse}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent>
              {attendanceData.map(course => (
                <SelectItem key={course.courseId} value={course.courseId}>
                  {course.courseName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedBatch}
            onValueChange={setSelectedBatch}
            disabled={!selectedCourse}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Batch" />
            </SelectTrigger>
            <SelectContent>
              {availableBatches.map(batch => (
                <SelectItem key={batch.id} value={batch.id}>
                  {batch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedSubject}
            onValueChange={setSelectedSubject}
            disabled={!selectedBatch}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              {availableSubjects.map(subject => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchQuery("");
            setSelectedCourse("");
            setSelectedBatch("");
            setSelectedSubject("");
          }}
          className="w-full sm:w-auto"
        >
          Clear Filters
        </Button>
      </div>

      {selectedSubject && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <h3 className="font-semibold">Average Lecture Attendance</h3>
                <p className="text-3xl text-black-600">
                  {attendanceData
                    .find(c => c.courseId === selectedCourse)
                    ?.batches.find(b => b.batchId === selectedBatch)
                    ?.subjects.find(s => s.subjectId === selectedSubject)
                    ?.attendance.averageLectureAttendance}%
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold">Average Lab Attendance</h3>
                <p className="text-3xl text-black-600">
                  {attendanceData
                    .find(c => c.courseId === selectedCourse)
                    ?.batches.find(b => b.batchId === selectedBatch)
                    ?.subjects.find(s => s.subjectId === selectedSubject)
                    ?.attendance.averageLabAttendance}%
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold">Overall Attendance</h3>
                <p className="text-3xl text-black-600">
                  {attendanceData
                    .find(c => c.courseId === selectedCourse)
                    ?.batches.find(b => b.batchId === selectedBatch)
                    ?.subjects.find(s => s.subjectId === selectedSubject)
                    ?.attendance.averageOverallAttendance}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Table>
        <TableHeader>
          <TableRow>
          <TableHead>Name</TableHead>
            <TableHead>Enrollment Number</TableHead>
            <TableHead>Lecture Attendance</TableHead>
            <TableHead>Lab Attendance</TableHead>
            <TableHead>Overall Attendance</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getFilteredStudents().map((student) => (
            <TableRow key={student.studentId} className="hover:bg-gray-100">
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.enrollmentNumber}</TableCell>
              <TableCell>{`${student.lecturesAttended}/${student.totalLecturesTaken} (${student.lecturePercentage}%)`}</TableCell>
              <TableCell>{`${student.labsAttended}/${student.totalLabsTaken} (${student.labPercentage}%)`}</TableCell>
              <TableCell>{`${student.overallAttendancePercentage}%`}</TableCell>
              <TableCell>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(student)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Attendance Details - {selectedStudent?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-semibold">Student Information</h3>
                <p>Email: {selectedStudent?.email}</p>
                <p>Enrollment: {selectedStudent?.enrollmentNumber}</p>
              </div>
              <div>
                <h3 className="font-semibold">Attendance Summary</h3>
                <p>Overall Attendance: {selectedStudent?.overallAttendancePercentage}%</p>
                <p>Lecture Attendance: {selectedStudent?.lecturePercentage}%</p>
                <p>Lab Attendance: {selectedStudent?.labPercentage}%</p>
              </div>
            </div>
            
            {renderDetailedAttendance()}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {  
                setIsModalOpen(false);
                setSelectedDate(null);
                setAttendanceRecords([]);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttendanceTab;
