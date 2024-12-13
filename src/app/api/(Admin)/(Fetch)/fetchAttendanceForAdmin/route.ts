import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/utils/auth';
import { AttendanceType } from '@prisma/client';

interface AttendanceStats {
  totalLectures: number;
  totalLabs: number;
  averageLectureAttendance: number;
  averageLabAttendance: number;
  averageOverallAttendance: number;
  studentDetails: StudentAttendanceDetails[];
  lectureDates: Date[];
  labDates: Date[];
}

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

interface CourseAttendanceResponse {
  courseId: string;
  courseName: string;
  batches: {
    batchId: string;
    batchName: string;
    subjects: {
      subjectId: string;
      subjectName: string;
      attendance: AttendanceStats;
    }[];
  }[];
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication and admin role
    const decodedUser = verifyToken();
    if (!decodedUser?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Verify if the user is an admin
    const user = await prisma.user.findUnique({
      where: { id: decodedUser.id },
      select: { role: true }
    });

    if (user?.role !== 'Admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    // Fetch all courses with their batches and subjects
    const courses = await prisma.course.findMany({
      where: { isActive: true },
      include: {
        batches: {
          where: { isActive: true },
          include: {
            subjects: {
              include: {
                subject: true
              }
            }
          }
        }
      }
    });

    // Process attendance for each course
    const courseAttendance: CourseAttendanceResponse[] = await Promise.all(
      courses.map(async (course) => {
        const batchAttendance = await Promise.all(
          course.batches.map(async (batch) => {
            const subjectAttendance = await Promise.all(
              batch.subjects.map(async (batchSubject) => {
                // Get students in the batch
                const students = await prisma.studentDetails.findMany({
                  where: { batchName: batch.batchName },
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    enrollmentNumber: true
                  }
                });

                const distinctLectureDates = await prisma.attendance.findMany({
                  where: {
                    subjectId: batchSubject.subjectId,
                    batchId: batch.batchId,
                    type: AttendanceType.LECTURE
                  },
                  select: { date: true },
                  distinct: ['date']
                });

                const distinctLabDates = await prisma.attendance.findMany({
                  where: {
                    subjectId: batchSubject.subjectId,
                    batchId: batch.batchId,
                    type: AttendanceType.LAB
                  },
                  select: { date: true },
                  distinct: ['date']
                });

                const totalLectures = distinctLectureDates.length;
                const totalLabs = distinctLabDates.length;

                // Calculate attendance for each student
                const studentAttendanceDetails: StudentAttendanceDetails[] = await Promise.all(
                  students.map(async (student) => {
                    const lecturesAttended = await prisma.attendance.groupBy({
                      by: ['date'],
                      where: {
                        studentId: student.id,
                        subjectId: batchSubject.subjectId,
                        batchId: batch.batchId,
                        type: AttendanceType.LECTURE,
                        isPresent: true
                      },
                      _count: true
                    });

                    const labsAttended = await prisma.attendance.groupBy({
                      by: ['date'],
                      where: {
                        studentId: student.id,
                        subjectId: batchSubject.subjectId,
                        batchId: batch.batchId,
                        type: AttendanceType.LAB,
                        isPresent: true
                      },
                      _count: true
                    });

                    const lectureAttendanceCount = lecturesAttended.length;
                    const labAttendanceCount = labsAttended.length;

                    const lecturePercentage = totalLectures > 0
                      ? Number(((lectureAttendanceCount / totalLectures) * 100).toFixed(2))
                      : 0;

                    const labPercentage = totalLabs > 0
                      ? Number(((labAttendanceCount / totalLabs) * 100).toFixed(2))
                      : 0;

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

                // Calculate batch averages for the subject
                const averageLectureAttendance = Number(
                  (studentAttendanceDetails.reduce((sum, student) =>
                    sum + student.lecturePercentage, 0) / (students.length || 1)).toFixed(2)
                );

                const averageLabAttendance = Number(
                  (studentAttendanceDetails.reduce((sum, student) =>
                    sum + student.labPercentage, 0) / (students.length || 1)).toFixed(2)
                );

                const averageOverallAttendance = Number(
                  (studentAttendanceDetails.reduce((sum, student) =>
                    sum + student.overallAttendancePercentage, 0) / (students.length || 1)).toFixed(2)
                );

                return {
                  subjectId: batchSubject.subjectId,
                  subjectName: batchSubject.subject.subjectName,
                  attendance: {
                    totalLectures,
                    totalLabs,
                    averageLectureAttendance,
                    averageLabAttendance,
                    averageOverallAttendance,
                    studentDetails: studentAttendanceDetails,
                    lectureDates: distinctLectureDates.map(d => d.date),
                    labDates: distinctLabDates.map(d => d.date)
                  }
                };
              })
            );

            return {
              batchId: batch.batchId,
              batchName: batch.batchName,
              subjects: subjectAttendance
            };
          })
        );

        return {
          courseId: course.courseId,
          courseName: course.courseName,
          batches: batchAttendance
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: courseAttendance
    });

  } catch (error) {
    console.error('Error calculating attendance:', error);
    return NextResponse.json(
      { success: false, message: 'Error calculating attendance' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}