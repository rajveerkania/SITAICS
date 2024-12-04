import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/utils/auth';
import { AttendanceType, Role } from '@prisma/client';

interface AttendanceStats {
  totalLectures: number;
  totalLabs: number;
  lecturesAttended: number;
  labsAttended: number;
  lecturePercentage: number;
  labPercentage: number;
  overallPercentage: number;
  studentName?: string;
  subjectName?: string;
  batchName?: string;
  studentDetails?: {
    studentId: string;
    name: string;
    enrollmentNumber: string;
  };
  attendanceRecords: Array<{
    date: Date;
    type: AttendanceType;
    isPresent: boolean;
    studentName?: string;
    studentId?: string;
    enrollmentNumber?: string;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication and role
    const decodedUser = verifyToken();
    if (!decodedUser?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Check if the user is an admin or staff
    const user = await prisma.user.findUnique({
      where: { id: decodedUser.id },
      select: { role: true }
    });

    if (user?.role !== Role.Admin && user?.role !== Role.Staff) {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');
    const subjectId = searchParams.get('subjectId');
    const batchId = searchParams.get('batchId');

    // Validate input parameters
    if (!studentId && !subjectId && !batchId) {
      return NextResponse.json(
        { success: false, message: 'At least one parameter (studentId, subjectId, or batchId) is required' },
        { status: 400 }
      );
    }

    // Prepare the base query
    const whereClause: any = {};
    if (studentId) whereClause.studentId = studentId;
    if (subjectId) whereClause.subjectId = subjectId;
    if (batchId) whereClause.batchId = batchId;

    // Fetch attendance records with additional details
    const attendanceRecords = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            name: true,
            enrollmentNumber: true
          }
        },
        subject: {
          select: {
            subjectName: true
          }
        },
        batch: {
          select: {
            batchName: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    // Group attendance by various criteria
    const groupedAttendance = attendanceRecords.reduce((acc, record) => {
      const key = record.type === AttendanceType.LECTURE ? 'lectures' : 'labs';
      if (!acc[key]) {
        acc[key] = {
          total: 0,
          attended: 0,
          records: []
        };
      }
      
      acc[key].total++;
      if (record.isPresent) acc[key].attended++;
      
      acc[key].records.push({
        date: record.date,
        type: record.type,
        isPresent: record.isPresent,
        studentName: record.student.name,
        studentId: record.studentId,
        enrollmentNumber: record.student.enrollmentNumber
      });

      return acc;
    }, {} as Record<string, { total: number; attended: number; records: any[] }>);

    // Prepare statistics
    const stats: AttendanceStats = {
      totalLectures: groupedAttendance.lectures?.total || 0,
      totalLabs: groupedAttendance.labs?.total || 0,
      lecturesAttended: groupedAttendance.lectures?.attended || 0,
      labsAttended: groupedAttendance.labs?.attended || 0,
      lecturePercentage: groupedAttendance.lectures 
        ? Number(((groupedAttendance.lectures.attended / groupedAttendance.lectures.total) * 100).toFixed(2))
        : 0,
      labPercentage: groupedAttendance.labs
        ? Number(((groupedAttendance.labs.attended / groupedAttendance.labs.total) * 100).toFixed(2))
        : 0,
      overallPercentage: 0, // Will be calculated dynamically
      attendanceRecords: [
        ...(groupedAttendance.lectures?.records || []),
        ...(groupedAttendance.labs?.records || [])
      ]
    };

    // Calculate overall percentage (lab attendance counts double)
    const totalWeightedClasses = stats.totalLectures + (stats.totalLabs * 2);
    const weightedAttendedClasses = stats.lecturesAttended + (stats.labsAttended * 2);
    stats.overallPercentage = totalWeightedClasses > 0
      ? Number(((weightedAttendedClasses / totalWeightedClasses) * 100).toFixed(2))
      : 0;

    // If a specific student was queried, add student details
    if (studentId) {
      const studentDetails = await prisma.studentDetails.findUnique({
        where: { id: studentId },
        select: {
          id: true,
          name: true,
          enrollmentNumber: true,
          course: { select: { courseName: true } },
          batch: { select: { batchName: true } }
        }
      });

      if (studentDetails) {
        stats.studentDetails = {
          studentId: studentDetails.id,
          name: studentDetails.name,
          enrollmentNumber: studentDetails.enrollmentNumber || ''
        };
        stats.batchName = studentDetails.batch?.batchName;
      }
    }

    // If a specific subject was queried, add subject name
    if (subjectId) {
      const subject = await prisma.subject.findUnique({
        where: { subjectId },
        select: { subjectName: true }
      });
      if (subject) stats.subjectName = subject.subjectName;
    }

    // If a specific batch was queried, add batch name
    if (batchId) {
      const batch = await prisma.batch.findUnique({
        where: { batchId },
        select: { batchName: true }
      });
      if (batch) stats.batchName = batch.batchName;
    }

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching admin attendance:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching attendance data' },
      { status: 500 }
    );
  }
}