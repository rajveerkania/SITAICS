import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { AttendanceRecord } from '@/types/type';
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const decodedUser = verifyToken();
    if (!decodedUser) {
      return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
    }
    const userRole = decodedUser.role;
  
    if (userRole !== "Staff") {
      return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
    }
  
  try {
    const staffId = decodedUser.id;

     const data: AttendanceRecord = await request.json();
    
    // Validate staff is assigned to this subject and batch
    const staffAssignment = await prisma.staffDetails.findFirst({
      where: {
        id: staffId,
        subjects: {
          some: {
            subjectId: data.subjectId
          }
        }
      }
    });

    if (!staffAssignment) {
      return NextResponse.json(
        { message: 'Not authorized to mark attendance for this subject' },
        { status: 403 }
      );
    }

    // Begin transaction to save all attendance records
    const attendanceRecords = await prisma.$transaction(
      data.students.map((student: { id: any; isPresent: any; }) => 
        prisma.attendance.create({
          data: {
            studentId: student.id,
            subjectId: data.subjectId,
            batchId: data.batchId,
            date: new Date(data.date),
            isPresent: student.isPresent,
            type: data.isLab ? 'Lab' : 'Lecture',
            staffId: staffId
          }
        })
      )
    );

    return NextResponse.json({
      message: 'Attendance recorded successfully',
      data: attendanceRecords
    });

  } catch (error: any) {
    console.error('Error recording attendance:', error);
    return NextResponse.json(
      { message: 'Error recording attendance', error: error?.message },
      { status: 500 }
    );
  }
}

