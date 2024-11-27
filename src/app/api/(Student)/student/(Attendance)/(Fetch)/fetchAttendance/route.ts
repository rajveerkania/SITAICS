import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/utils/auth';
import { AttendanceType } from '@prisma/client';

interface AttendanceStats {
  totalLectures: number;
  totalLabs: number;
  lecturesAttended: number;
  labsAttended: number;
  lecturePercentage: number;
  labPercentage: number;
  overallPercentage: number;
  lectureAttendance: Array<{
    date: Date;
    isPresent: boolean;
  }>;
  labAttendance: Array<{
    date: Date;
    isPresent: boolean;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const decodedUser = verifyToken();
    if (!decodedUser?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');
    const subjectId = searchParams.get('subjectId');
    
    if (!studentId || !subjectId) {
      return NextResponse.json(
        { success: false, message: 'Student ID and Subject ID are required' },
        { status: 400 }
      );
    }

    // Get all distinct lecture dates for this subject
    const distinctLectureDates = await prisma.attendance.findMany({
      where: {
        subjectId,
        type: AttendanceType.LECTURE
      },
      select: {
        date: true
      },
      distinct: ['date']
    });

    // Get all distinct lab dates for this subject
    const distinctLabDates = await prisma.attendance.findMany({
      where: {
        subjectId,
        type: AttendanceType.LAB
      },
      select: {
        date: true
      },
      distinct: ['date']
    });

    // Get student's lecture attendance records
    const lectureAttendance = await prisma.attendance.findMany({
      where: {
        studentId,
        subjectId,
        type: AttendanceType.LECTURE
      },
      select: {
        date: true,
        isPresent: true
      },
      orderBy: {
        date: 'asc'
      }
    });

    // Get student's lab attendance records
    const labAttendance = await prisma.attendance.findMany({
      where: {
        studentId,
        subjectId,
        type: AttendanceType.LAB
      },
      select: {
        date: true,
        isPresent: true
      },
      orderBy: {
        date: 'asc'
      }
    });

    // Calculate statistics
    const totalLectures = distinctLectureDates.length;
    const totalLabs = distinctLabDates.length;
    const lecturesAttended = lectureAttendance.filter(record => record.isPresent).length;
    const labsAttended = labAttendance.filter(record => record.isPresent).length;

    const lecturePercentage = totalLectures > 0 
      ? Number(((lecturesAttended / totalLectures) * 100).toFixed(2))
      : 0;

    const labPercentage = totalLabs > 0 
      ? Number(((labsAttended / totalLabs) * 100).toFixed(2))
      : 0;

    // Calculate overall percentage (lab attendance counts double)
    const totalWeightedClasses = totalLectures + (totalLabs * 2);
    const weightedAttendedClasses = lecturesAttended + (labsAttended * 2);
    const overallPercentage = totalWeightedClasses > 0
      ? Number(((weightedAttendedClasses / totalWeightedClasses) * 100).toFixed(2))
      : 0;

    const stats: AttendanceStats = {
      totalLectures,
      totalLabs,
      lecturesAttended,
      labsAttended,
      lecturePercentage,
      labPercentage,
      overallPercentage,
      lectureAttendance,
      labAttendance
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching student attendance:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching attendance data' },
      { status: 500 }
    );
  }
}