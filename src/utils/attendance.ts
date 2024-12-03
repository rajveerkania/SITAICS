// utils/attendance.ts
import { DetailedAttendanceRecord, SubjectAttendanceStats } from '@/lib/attendance';

export function calculateSubjectAttendance(records: DetailedAttendanceRecord[]): SubjectAttendanceStats {
  const lectureRecords = records.filter(record => record.sessionType === 'LECTURE');
  const labRecords = records.filter(record => record.sessionType === 'LAB');

  const lectureStats = {
    total: lectureRecords.length,
    attended: lectureRecords.filter(record => record.isPresent).length,
    dates: [...new Set(lectureRecords.map(record => record.date))]
  };

  const labStats = {
    total: labRecords.length,
    attended: labRecords.filter(record => record.isPresent).length,
    dates: [...new Set(labRecords.map(record => record.date))]
  };

  // Weighted calculation: Lectures count as 1, Labs count as 2
  const weightedTotal = lectureStats.total + (labStats.total * 2);
  const weightedAttended = lectureStats.attended + (labStats.attended * 2);
  const weightedAttendancePercentage = weightedTotal > 0 
    ? (weightedAttended / weightedTotal) * 100 
    : 0;

  return {
    subjectName: '', // Will be filled later
    totalLecturesTaken: lectureStats.total,
    lecturesAttended: lectureStats.attended,
    totalLabsTaken: labStats.total,
    labsAttended: labStats.attended,
    attendanceDates: {
      lectures: lectureStats.dates,
      labs: labStats.dates
    },
    weightedAttendancePercentage
  };
}