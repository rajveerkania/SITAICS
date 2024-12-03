import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/utils/auth';
import { AttendanceType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const decodedUser = verifyToken();
    if (!decodedUser?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const subjectId = searchParams.get('subjectId');
    const courseId = searchParams.get('courseId');
    const batchId = searchParams.get('batchId');

    if (!studentId || !subjectId || !courseId || !batchId) {
      return NextResponse.json(
        { success: false, message: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Fetch detailed student attendance
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        studentId,
        subjectId,
        batchId,
      },
      include: {
        subject: true,
        staff: true,
      },
      orderBy: {
        date: 'desc'
      }
    });

    // Group attendance by type and calculate summary
    const lectureAttendance = attendanceRecords.filter(record => record.type === AttendanceType.LECTURE);
    const labAttendance = attendanceRecords.filter(record => record.type === AttendanceType.Lab);

    const summary = {
      totalLectures: new Set(lectureAttendance.map(a => a.date.toDateString())).size,
      totalLabs: new Set(labAttendance.map(a => a.date.toDateString())).size,
      lecturesAttended: lectureAttendance.filter(a => a.isPresent).length,
      labsAttended: labAttendance.filter(a => a.isPresent).length,
      lecturePercentage: Number(((lectureAttendance.filter(a => a.isPresent).length / lectureAttendance.length) * 100 || 0).toFixed(2)),
      labPercentage: Number(((labAttendance.filter(a => a.isPresent).length / labAttendance.length) * 100 || 0).toFixed(2)),
    };

    return NextResponse.json({
      success: true,
      data: {
        attendanceRecords,
        summary
      }
    });

  } catch (error) {
    console.error('Error fetching student attendance:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching student attendance' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}