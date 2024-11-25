import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/utils/auth';
import { AttendanceType } from '@prisma/client';

interface StudentAttendanceDetails {
  studentId: string;
  name: string;
  email: string;
  enrollmentNumber: string;
  totalLecturesTaken: number;
  lecturesAttended: number;
  lecturePercentage: number;
  totalLabsTaken: number;
  labsAttended: number;
  labPercentage: number;
  overallAttendancePercentage: number;
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
    const subjectId = searchParams.get('subjectId');
    const batchId = searchParams.get('batchId');
    
    if (!subjectId || !batchId) {
      return NextResponse.json(
        { success: false, message: 'Subject ID and Batch ID are required' },
        { status: 400 }
      );
    }

    // Get all students in the batch
    const students = await prisma.studentDetails.findMany({
      where: {
        batch: {
          batchId: batchId
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        enrollmentNumber: true
      }
    });

    // Get distinct lecture dates
    const distinctLectureDates = await prisma.attendance.findMany({
      where: {
        subjectId: subjectId,
        batchId: batchId,
        type: AttendanceType.LECTURE
      },
      select: {
        date: true
      },
      distinct: ['date']
    });

    // Get distinct lab dates
    const distinctLabDates = await prisma.attendance.findMany({
      where: {
        subjectId: subjectId,
        batchId: batchId,
        type: AttendanceType.Lab
      },
      select: {
        date: true
      },
      distinct: ['date']
    });

    // Calculate total lectures and labs based on distinct dates
    const totalLectures = distinctLectureDates.length;
    const totalLabs = distinctLabDates.length;

    console.log('Total Distinct Lecture Dates:', totalLectures);
    console.log('Total Distinct Lab Dates:', totalLabs);

    // Get all attendance records for the batch and subject
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        subjectId: subjectId,
        batchId: batchId
      }
    });

    // Calculate attendance for each student
    const studentAttendanceDetails: StudentAttendanceDetails[] = await Promise.all(
      students.map(async (student) => {
        // Get student's attendance records
        const studentRecords = attendanceRecords.filter(
          record => record.studentId === student.id
        );

        // Count distinct dates where student was present for lectures
        const lecturesAttended = await prisma.attendance.groupBy({
          by: ['date'],
          where: {
            studentId: student.id,
            subjectId: subjectId,
            batchId: batchId,
            type: AttendanceType.LECTURE,
            isPresent: true
          },
          _count: true
        });

        // Count distinct dates where student was present for labs
        const labsAttended = await prisma.attendance.groupBy({
          by: ['date'],
          where: {
            studentId: student.id,
            subjectId: subjectId,
            batchId: batchId,
            type: AttendanceType.Lab,
            isPresent: true
          },
          _count: true
        });

        const lectureAttendanceCount = lecturesAttended.length;
        const labAttendanceCount = labsAttended.length;

        // Calculate percentages
        const lecturePercentage = totalLectures > 0 
          ? Number(((lectureAttendanceCount / totalLectures) * 100).toFixed(2))
          : 0;

        const labPercentage = totalLabs > 0 
          ? Number(((labAttendanceCount / totalLabs) * 100).toFixed(2))
          : 0;

        // Weighted calculation (Lab counts double)
        const totalWeightedClasses = totalLectures + (totalLabs * 2);
        const weightedAttendedClasses = lectureAttendanceCount + (labAttendanceCount * 2);
        const overallAttendancePercentage = totalWeightedClasses > 0
          ? Number(((weightedAttendedClasses / totalWeightedClasses) * 100).toFixed(2))
          : 0;

        return {
          studentId: student.id,
          name: student.name,
          email: student.email,
          enrollmentNumber: student.enrollmentNumber || '',
          totalLecturesTaken: totalLectures,
          lecturesAttended: lectureAttendanceCount,
          lecturePercentage,
          totalLabsTaken: totalLabs,
          labsAttended: labAttendanceCount,
          labPercentage,
          overallAttendancePercentage
        };
      })
    );

    // Calculate batch averages
    const batchAverages = {
      averageLectureAttendance: Number((studentAttendanceDetails.reduce((sum, student) => 
        sum + student.lecturePercentage, 0) / students.length).toFixed(2)),
      averageLabAttendance: Number((studentAttendanceDetails.reduce((sum, student) => 
        sum + student.labPercentage, 0) / students.length).toFixed(2)),
      averageOverallAttendance: Number((studentAttendanceDetails.reduce((sum, student) => 
        sum + student.overallAttendancePercentage, 0) / students.length).toFixed(2))
    };

    return NextResponse.json({
      success: true,
      data: {
        totalLectures,
        totalLabs,
        batchAverages,
        studentAttendanceDetails,
        lectureDates: distinctLectureDates.map(d => d.date),
        labDates: distinctLabDates.map(d => d.date)
      }
    });

  } catch (error) {
    console.error('Error calculating attendance:', error);
    return NextResponse.json(
      { success: false, message: 'Error calculating attendance' },
      { status: 500 }
    );
  }
}