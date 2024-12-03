"use client"
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface AttendanceRecord {
  id: string;
  date: Date;
  type: 'LECTURE' | 'LAB';
  isPresent: boolean;
}

interface AttendanceSummary {
  totalLectures: number;
  totalLabs: number;
  lecturesAttended: number;
  labsAttended: number;
  lecturePercentage: number;
  labPercentage: number;
}

const StudentAttendanceDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const { studentId, courseId, subjectId, batchId } = params;

  useEffect(() => {
    const fetchStudentAttendance = async () => {
      try {
        const response = await fetch(`/api/fetchStudentAttendance?studentId=${studentId}&courseId=${courseId}&subjectId=${subjectId}&batchId=${batchId}`);
        const result = await response.json();

        if (result.success) {
          // Ensure dates are properly parsed
          const parsedRecords = result.data.attendanceRecords.map((record: AttendanceRecord) => ({
            ...record,
            date: new Date(record.date)
          }));

          setAttendanceRecords(parsedRecords);
          setSummary(result.data.summary);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error('Failed to fetch attendance records');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentAttendance();
  }, [studentId, courseId, subjectId, batchId]);

  const updateAttendance = async (attendanceId: string, isPresent: boolean) => {
    try {
      const response = await fetch('/api/updateAttendance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          attendanceId, 
          isPresent,
          studentId,
          courseId,
          subjectId,
          batchId 
        })
      });

      const result = await response.json();
      if (result.success) {
        // Update local state
        setAttendanceRecords(prev => 
          prev.map(record => 
            record.id === attendanceId ? { ...record, isPresent } : record
          )
        );
        
        // Update summary
        if (summary) {
          const updatedSummary = { ...summary };
          const record = attendanceRecords.find(r => r.id === attendanceId);
          
          if (record) {
            if (record.type === 'LECTURE') {
              updatedSummary.lecturesAttended += isPresent ? 1 : -1;
              updatedSummary.lecturePercentage = 
                (updatedSummary.lecturesAttended / summary.totalLectures) * 100;
            } else {
              updatedSummary.labsAttended += isPresent ? 1 : -1;
              updatedSummary.labPercentage = 
                (updatedSummary.labsAttended / summary.totalLabs) * 100;
            }
            setSummary(updatedSummary);
          }
        }
        
        toast.success('Attendance updated successfully');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to update attendance');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Attendance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {summary && (
            <div className="space-y-2">
              <p>Total Lectures: {summary.totalLectures}</p>
              <p>Lectures Attended: {summary.lecturesAttended} ({summary.lecturePercentage.toFixed(2)}%)</p>
              <p>Total Labs: {summary.totalLabs}</p>
              <p>Labs Attended: {summary.labsAttended} ({summary.labPercentage.toFixed(2)}%)</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.length > 0 ? (
                attendanceRecords.map(record => (
                  <TableRow key={record.id}>
                    <TableCell>{format(record.date, 'PPP')}</TableCell>
                    <TableCell>{record.type}</TableCell>
                    <TableCell>{record.isPresent ? 'Present' : 'Absent'}</TableCell>
                    <TableCell>
                      <Switch
                        checked={record.isPresent}
                        onCheckedChange={(checked) => updateAttendance(record.id, checked)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No attendance records found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-4 flex justify-end">
        <Button variant="outline" onClick={() => router.back()}>
          Back to Attendance
        </Button>
      </div>
    </div>
  );
};

export default StudentAttendanceDetailsPage;