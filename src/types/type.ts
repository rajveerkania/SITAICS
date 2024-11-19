// types/type.ts

export type DayOfWeek = 'SUNDAY' | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY';

export interface AttendanceSettings {
  subjectId: string;
  batchId: string;
  lecturesPerWeek: number;
  labsPerWeek: number;
  hasLabs: boolean;
  lectureDays: DayOfWeek[];
  labDays: DayOfWeek[];
  sessionStartDate: string;
  sessionEndDate: string;
}

export interface AttendanceType {
  date: string;
  type: 'Lecture' | 'Lab';
}
export interface Student {
  id: string;
  name: string;
  isPresent: boolean;
  overallPercentage: number;
}

export interface AttendanceRecord {
  subjectId: string;
  batchId: string;
  isLab: boolean;
  date: string;
  students: Student[];
}
