import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/utils/auth';
import { AttendanceType } from '@prisma/client';

interface AttendanceRequest {
  subjectId: string;
  batchId: string;
  sessionType: string;
  date: string;
  students: {
    id: string;
    isPresent: boolean;
  }[];
}

export async function POST(request: NextRequest) {
  try {
    // Verify staff authentication
    const decodedUser = verifyToken();
    const staffId = decodedUser?.id;

    if (!staffId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: AttendanceRequest = await request.json();
    const { subjectId, batchId, sessionType, date, students } = body;

    // Validate required fields
    if (!subjectId || !batchId || !sessionType || !date || !students?.length) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate session type
    if (!Object.values(AttendanceType).includes(sessionType.toUpperCase() as AttendanceType)) {
      return NextResponse.json(
        { success: false, message: 'Invalid session type. Must be either "lecture" or "lab"' },
        { status: 400 }
      );
    }

    const attendanceType = sessionType.toUpperCase() as AttendanceType;

    // Validate date format and create Date object
    const attendanceDate = new Date(date);
    if (isNaN(attendanceDate.getTime())) {
      return NextResponse.json(
        { success: false, message: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Check if subject exists
    const subject = await prisma.subject.findUnique({
      where: { subjectId },
    });

    if (!subject) {
      return NextResponse.json(
        { success: false, message: 'Subject not found' },
        { status: 404 }
      );
    }

    // Check if batch exists
    const batch = await prisma.batch.findUnique({
      where: { batchId },
    });

    if (!batch) {
      return NextResponse.json(
        { success: false, message: 'Batch not found' },
        { status: 404 }
      );
    }

    // Check if attendance already exists for this date, subject, batch, and type
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        subjectId,
        batchId,
        date: attendanceDate,
        type: attendanceType,
      },
    });

    if (existingAttendance) {
      return NextResponse.json(
        { success: false, message: 'Attendance already marked for this session' },
        { status: 409 }
      );
    }

    // Create attendance records for all students
    const attendanceRecords = students.map((student) => ({
      studentId: student.id,
      subjectId,
      batchId,
      staffId,
      date: attendanceDate,
      isPresent: student.isPresent,
      type: attendanceType,
    }));

    // Use transaction to ensure all records are created or none
    const result = await prisma.$transaction(async (prisma) => {
      const attendanceCreated = await prisma.attendance.createMany({
        data: attendanceRecords,
      });

      // Fetch attendance summary for this subject and batch
      const attendanceSummary = await prisma.attendance.findMany({
        where: {
          subjectId,
          batchId,
          date: attendanceDate,
          type: attendanceType,
        },
        select: {
          isPresent: true,
          type: true,
        },
      });

      // Calculate attendance statistics
      const totalAttendance = attendanceSummary.length;
      const totalPresent = attendanceSummary.filter((record) => record.isPresent).length;
      const totalAbsent = totalAttendance - totalPresent;

      return {
        count: attendanceCreated.count,
        totalAttendance,
        totalPresent,
        totalAbsent,
      };
    });

    return NextResponse.json({
      success: true,
      message: 'Attendance recorded successfully',
      data: {
        totalAttendance: result.totalAttendance,
        totalPresent: result.totalPresent,
        totalAbsent: result.totalAbsent,
      },
    });
  } catch (error) {
    console.error('Error recording attendance:', error);
    return NextResponse.json(
      { success: false, message: 'Error recording attendance' },
      { status: 500 }
    );
  }
}