import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { format, eachDayOfInterval, parseISO } from 'date-fns';
import { AttendanceSchedule, AttendanceSettings, DayOfWeek } from '@/types/type';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const settings: AttendanceSettings = await request.json();
    
    // Validate that subject exists
    const subject = await prisma.subject.findUnique({
      where: { subjectId: settings.subjectId }
    });
    
    if (!subject) {
      return NextResponse.json(
        { message: 'Subject not found' },
        { status: 404 }
      );
    }

    // Validate that batch exists
    const batch = await prisma.batch.findUnique({
      where: { batchId: settings.batchId }
    });
    
    if (!batch) {
      return NextResponse.json(
        { message: 'Batch not found' },
        { status: 404 }
      );
    }

    // Check if settings already exist for this subject and batch
    const existingSettings = await prisma.attendanceSettings.findUnique({
      where: {
        subjectId_batchId: {
          subjectId: settings.subjectId,
          batchId: settings.batchId
        }
      }
    });

    const schedule = generateAttendanceSchedule(settings);
    
    if (existingSettings) {
      // Update existing settings
      const updatedSettings = await prisma.attendanceSettings.update({
        where: {
          subjectId_batchId: {
            subjectId: settings.subjectId,
            batchId: settings.batchId
          }
        },
        data: {
          lecturesPerWeek: settings.lecturesPerWeek,
          labsPerWeek: settings.labsPerWeek,
          hasLabs: settings.hasLabs,
          lectureDays: JSON.stringify(settings.lectureDays),
          labDays: JSON.stringify(settings.labDays),
          sessionStartDate: new Date(settings.sessionStartDate),
          sessionEndDate: new Date(settings.sessionEndDate),
          attendanceSchedule: JSON.stringify(schedule)
        }
      });

      return NextResponse.json({ 
        message: 'Settings updated successfully',
        schedule,
        settings: updatedSettings
      });
    }

    // Create new settings
    const newSettings = await prisma.attendanceSettings.create({
      data: {
        subjectId: settings.subjectId,
        batchId: settings.batchId,
        lecturesPerWeek: settings.lecturesPerWeek,
        labsPerWeek: settings.labsPerWeek,
        hasLabs: settings.hasLabs,
        lectureDays: JSON.stringify(settings.lectureDays),
        labDays: JSON.stringify(settings.labDays),
        sessionStartDate: new Date(settings.sessionStartDate),
        sessionEndDate: new Date(settings.sessionEndDate),
        attendanceSchedule: JSON.stringify(schedule)
      }
    });

    return NextResponse.json({ 
      message: 'Settings saved successfully',
      schedule,
      settings: newSettings
    });
  } catch (error: any) {
    console.error('Error saving settings:', error);
    
    // Handle specific Prisma errors
    if (error?.code === 'P2003') {
      return NextResponse.json(
        { message: 'Invalid subject or batch ID provided' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Error saving settings', error: error?.message },
      { status: 500 }
    );
  }
}

function generateAttendanceSchedule(settings: AttendanceSettings): AttendanceSchedule[] {
  const schedule: AttendanceSchedule[] = [];
  const interval = {
    start: parseISO(settings.sessionStartDate),
    end: parseISO(settings.sessionEndDate)
  };
  
  const weekdays: DayOfWeek[] = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  
  eachDayOfInterval(interval).forEach(date => {
    const dayOfWeek = weekdays[date.getDay()] as DayOfWeek;
    
    // Skip weekends
    if (dayOfWeek !== 'SUNDAY' && dayOfWeek !== 'SATURDAY') {
      // Add lectures
      if (settings.lectureDays.includes(dayOfWeek)) {
        schedule.push({
          date: format(date, 'yyyy-MM-dd'),
          type: 'Lecture'
        });
      }
      
      // Add labs if enabled
      if (settings.hasLabs && settings.labDays.includes(dayOfWeek)) {
        schedule.push({
          date: format(date, 'yyyy-MM-dd'),
          type: 'Lab'
        });
      }
    }
  });
  
  return schedule;
}

export async function OPTIONS(request: Request) {
  return NextResponse.json({}, { status: 200 });
}