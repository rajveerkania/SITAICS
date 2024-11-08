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

export interface AttendanceSchedule {
  date: string;
  type: 'Lecture' | 'Lab';
}