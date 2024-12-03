// lib/attendance.ts
export interface DetailedAttendanceRecord {
  date: string;
  sessionType: 'LECTURE' | 'LAB';
  isPresent: boolean;
}

export interface SubjectAttendanceStats {
  subjectName: string;
  totalLecturesTaken: number;
  lecturesAttended: number;
  totalLabsTaken: number;
  labsAttended: number;
  attendanceDates: {
    lectures: string[];
    labs: string[];
  };
  weightedAttendancePercentage: number;
}

export interface StudentAttendanceRecord {
  studentId: string;
  name: string;
  email: string;
  enrollmentNumber: string;
  subjects: {
    [subjectId: string]: SubjectAttendanceStats;
  };
  overallAttendancePercentage: number;
}

export interface AttendanceRecordDB {
  id: string;
  studentId: string;
  subjectId: string;
  batchId?: string;
  staffId: string;
  createdAt: Date;
  updatedAt: Date;
  attendanceRecord: DetailedAttendanceRecord[];
  sessionType: 'LECTURE' | 'LAB';
}