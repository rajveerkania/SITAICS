import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/utils/auth';
import { AttendanceType, Role } from '@prisma/client';

interface AttendanceStats {
  subjects: Array<{
    subjectId: string;
    subjectName: string;
    totalLectures: number;
    totalLabs: number;
    lecturesAttended: number;
    labsAttended: number;
    lecturePercentage: number;
    labPercentage: number;
    overallPercentage: number;
    attendanceRecords: Array<{
      date: Date;
      type: AttendanceType;
      isPresent: boolean;
    }>;
  }>;
  studentDetails?: {
    studentId: string;
    name: string;
    enrollmentNumber: string;
    courseName?: string;
    batchName?: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    const decodedUser = verifyToken();
    if (!decodedUser?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access' },
        { status: 401 }
      );
    }

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

    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json(
        { success: false, message: 'StudentId is required' },
        { status: 400 }
      );
    }

    const studentDetails = await prisma.studentDetails.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        name: true,
        enrollmentNumber: true,
        courseName: true,
        batchName: true,
        batch: {
          select: {
            subjects: {
              select: {
                subject: true
              }
            }
          }
        }
      }
    });

    if (!studentDetails) {
      return NextResponse.json(
        { success: false, message: 'Student not found' },
        { status: 404 }
      );
    }

    const subjectIds = studentDetails.batch?.subjects.map(s => s.subject.subjectId) || [];
    
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        studentId: studentId,
        subjectId: {
          in: subjectIds
        }
      },
      include: {
        subject: {
          select: {
            subjectId: true,
            subjectName: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    const subjectAttendance = attendanceRecords.reduce((acc, record) => {
      const subjectId = record.subject.subjectId;
      if (!acc[subjectId]) {
        acc[subjectId] = {
          subjectId: record.subject.subjectId,
          subjectName: record.subject.subjectName,
          totalLectures: 0,
          totalLabs: 0,
          lecturesAttended: 0,
          labsAttended: 0,
          lecturePercentage: 0,
          labPercentage: 0,
          overallPercentage: 0,
          detailedAttendance: {
            lectures: [],
            labs: []
          }
        };
      }

      const attendanceEntry = {
        date: record.date,
        type: record.type,
        isPresent: record.isPresent
      };

      if (record.type === AttendanceType.LECTURE) {
        acc[subjectId].totalLectures++;
        acc[subjectId].detailedAttendance.lectures.push(attendanceEntry);
        if (record.isPresent) acc[subjectId].lecturesAttended++;
      } else {
        acc[subjectId].totalLabs++;
        acc[subjectId].detailedAttendance.labs.push(attendanceEntry);
        if (record.isPresent) acc[subjectId].labsAttended++;
      }

      return acc;
    }, {} as Record<string, {
      subjectId: string;
      subjectName: string;
      totalLectures: number;
      totalLabs: number;
      lecturesAttended: number;
      labsAttended: number;
      lecturePercentage: number;
      labPercentage: number;
      overallPercentage: number;
      detailedAttendance: {
        lectures: Array<{ date: Date; type: AttendanceType; isPresent: boolean }>;
        labs: Array<{ date: Date; type: AttendanceType; isPresent: boolean }>;
      }
    }>);

    const subjects = Object.values(subjectAttendance).map(subject => {
      subject.lecturePercentage = subject.totalLectures > 0
        ? Number(((subject.lecturesAttended / subject.totalLectures) * 100).toFixed(2))
        : 0;
    
      subject.labPercentage = subject.totalLabs > 0
        ? Number(((subject.labsAttended / subject.totalLabs) * 100).toFixed(2))
        : 0;
    
      const totalWeightedClasses = subject.totalLectures + (subject.totalLabs * 2);
      const weightedAttendedClasses = subject.lecturesAttended + (subject.labsAttended * 2);
      subject.overallPercentage = totalWeightedClasses > 0
        ? Number(((weightedAttendedClasses / totalWeightedClasses) * 100).toFixed(2))
        : 0;
    
      return {
        ...subject,
        attendanceRecords: [
          ...subject.detailedAttendance.lectures,
          ...subject.detailedAttendance.labs,
        ]
      };
    });
    
    const stats = {
      subjects,
      studentDetails: {
        studentId: studentDetails.id,
        name: studentDetails.name,
        enrollmentNumber: studentDetails.enrollmentNumber || '',
        courseName: studentDetails.courseName || undefined,
        batchName: studentDetails.batchName || undefined,
      }
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching attendance data' },
      { status: 500 }
    );
  }
}