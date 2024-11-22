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


export interface NotificationPayload {
  type: 'CIRCULAR' | 'COURSE' | 'BATCH' | 'SUBJECT';
  recipient?: string;
  message: string;
  courseName?: string;
  batchName?: string;
  subjectId?: string;
  sendToAllBatches?: boolean;
}

export interface Course {
  courseName: string;
}

export interface Batch {
  batchNames: string;
  batchName: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: string;
}