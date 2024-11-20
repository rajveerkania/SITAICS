import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  enrollmentNumber: string;
  isPresent: boolean;
  studentId?: string; // Optional, as it seems to be used in the view section
  totalLecturesTaken?: number;
  lecturesAttended?: number;
  lecturePercentage?: number;
  totalLabsTaken?: number;
  labsAttended?: number;
  labPercentage?: number;
  overallAttendancePercentage?: number;
}


interface Subject {
  subjectId: string;
  subjectName: string;
  batchId: string;
  batchName: string;
}

const Attendance = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [viewAttendanceData, setViewAttendanceData] = useState({
    batchId: '',
    subjectId: '',
  });
  const [attendanceData, setAttendanceData] = useState({
    subjectId: '',
    batchId: '',
    sessionType: '',
    date: format(new Date(), 'yyyy-MM-dd'),

  }

);

  useEffect(() => {
    loadSubjects();
  }, []);
  const fetchAttendance = async () => {
    if (!viewAttendanceData.batchId || !viewAttendanceData.subjectId) {
      toast.error('Please select batch and subject');
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await fetch(`/api/calculateAttendance?batchId=${viewAttendanceData.batchId}&subjectId=${viewAttendanceData.subjectId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
  
      const responseText = await response.text(); // First, get raw text
      console.log('Raw response:', responseText); // Log raw response
  
      // Check if response looks like JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
      }
  
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid JSON response');
      }
  
      if (data.success && data.data.studentAttendanceDetails) {
        setStudents(data.data.studentAttendanceDetails);
      } else {
        throw new Error(data.message || 'Unexpected response format');
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch attendance');
    } finally {
      setIsLoading(false);
    }
  };
  const loadSubjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/fetchSubjectsStaffAttendence', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to load subjects');

      const data = await response.json();
      if (data.success && Array.isArray(data.subjects)) {
        setSubjects(data.subjects);
        const uniqueBatches = Array.from(
          new Set(data.subjects.map((item: { batchId: any; }) => item.batchId))
        ).map(batchId => {
          const batchInfo = data.subjects.find((item: { batchId: any; }) => item.batchId === batchId);
          return {
            batchId: batchInfo.batchId,
            batchName: batchInfo.batchName
          };
        });
        setBatches(uniqueBatches);
      }
    } catch (error) { 
      console.error('Error loading subjects:', error);
      toast.error('Failed to load subjects');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStudents = async (batchName: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/fetchStudentsBatchwise?batchName=${encodeURIComponent(batchName)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to load students');
      }
      
      if (data.success && Array.isArray(data.students)) {
        setStudents(data.students.map((student: any) => ({
          ...student,
          isPresent: true
        })));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Failed to load students');
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchChange = (value: string) => {
    const selectedBatch = subjects.find(s => s.batchId === value);
    if (selectedBatch) {
      setAttendanceData(prev => ({ 
        ...prev, 
        batchId: selectedBatch.batchId,
        subjectId: selectedBatch.subjectId 
      }));
      loadStudents(selectedBatch.batchName);
    }
  };

  const handleSaveAttendance = async () => {
    if (!attendanceData.subjectId || !attendanceData.batchId || !attendanceData.sessionType) {
      toast.error('Please select subject, batch, and session type');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/markAttendance', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...attendanceData,
          date: selectedDate,
          students: students.map(student => ({
            id: student.id,
            isPresent: student.isPresent
          }))
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save attendance');
      }

      toast.success('Attendance saved successfully');
      // Reset form after successful save
      setStudents([]);
      setAttendanceData({
        subjectId: '',
        batchId: '',
        sessionType: '',
        date: format(new Date(), 'yyyy-MM-dd'),
      });
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save attendance');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleAttendance = (studentId: string) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId
          ? { ...student, isPresent: !student.isPresent }
          : student
      )
    );
  };

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="mark" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mark">Mark Attendance</TabsTrigger>
          <TabsTrigger value="view">View Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="mark">
          <Card>
            <CardHeader>
              <CardTitle>Mark Attendance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select
                  value={attendanceData.batchId}
                  onValueChange={handleBatchChange}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.batchId} value={subject.batchId}>
                        {subject.batchName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={attendanceData.subjectId}
                  onValueChange={(value) =>
                    setAttendanceData(prev => ({ ...prev, subjectId: value }))
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.subjectId} value={subject.subjectId}>
                        {subject.subjectName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={attendanceData.sessionType}
                  onValueChange={(value) =>
                    setAttendanceData(prev => ({ ...prev, sessionType: value }))
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Session Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lecture">Lecture</SelectItem>
                    <SelectItem value="lab">Lab</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {isLoading && (
                <div className="flex justify-center items-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              {!isLoading && students.length > 0 && (
                <div className="space-y-4">
                  <div className="border rounded-lg">
                    <div className="max-h-[500px] overflow-y-auto">
                      <table className="w-full">
                        <thead className="sticky top-0 bg-white">
                          <tr className="border-b">
                            <th className="p-2 text-left">Enrollment No</th>
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Email</th>
                            <th className="p-2 text-center">Present</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student) => (
                            <tr key={student.id} className="border-b">
                              <td className="p-2">{student.enrollmentNumber}</td>
                              <td className="p-2">{student.name}</td>
                              <td className="p-2">{student.email}</td>
                              <td className="p-2 text-center">
                                <Switch
                                  checked={student.isPresent}
                                  onCheckedChange={() => toggleAttendance(student.id)}
                                  disabled={isSaving}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveAttendance} 
                      disabled={isSaving}
                    >
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isSaving ? 'Saving...' : 'Save Attendance'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle>View Attendance Records</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  value={viewAttendanceData.batchId}
                  onValueChange={(value) => 
                    setViewAttendanceData(prev => ({ ...prev, batchId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch.batchId} value={batch.batchId}>
                        {batch.batchName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={viewAttendanceData.subjectId}
                  onValueChange={(value) => 
                    setViewAttendanceData(prev => ({ ...prev, subjectId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.subjectId} value={subject.subjectId}>
                        {subject.subjectName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button onClick={fetchAttendance} disabled={isLoading}>
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Fetching...</>
                  ) : (
                    'Fetch Attendance'
                  )}
                </Button>
              </div>

              {isLoading && (
                <div className="flex justify-center items-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              {!isLoading && students.length > 0 && (
                <div className="border rounded-lg">
                  <div className="max-h-[500px] overflow-y-auto">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-white">
                        <tr className="border-b">
                          <th className="p-2 text-left">Enrollment No</th>
                          <th className="p-2 text-left">Name</th>
                          <th className="p-2 text-left">Email</th>
                          <th className="p-2 text-center">Lectures</th>
                          <th className="p-2 text-center">Labs</th>
                          <th className="p-2 text-center">Overall</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student.studentId} className="border-b">
                            <td className="p-2">{student.enrollmentNumber}</td>
                            <td className="p-2">{student.name}</td>
                            <td className="p-2">{student.email}</td>
                            <td className="p-2 text-center">
                              {student.lecturesAttended} / {student.totalLecturesTaken} 
                              <br />({student.lecturePercentage}%)
                            </td>
                            <td className="p-2 text-center">
                              {student.labsAttended} / {student.totalLabsTaken}
                              <br />({student.labPercentage}%)
                            </td>
                            <td className="p-2 text-center font-bold">
                              {student.overallAttendancePercentage}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Attendance;