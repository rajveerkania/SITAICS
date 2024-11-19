// app/api/attendance/students/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/utils/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify staff authentication
    const decodedUser = verifyToken();
    const staffId = decodedUser?.id;

    if (!staffId) {
      return NextResponse.json(
        { message: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Get batchName from search params
    const searchParams = request.nextUrl.searchParams;
    const batchName = searchParams.get('batchName');

    if (!batchName) {
      return NextResponse.json(
        { message: 'Batch name is required' },
        { status: 400 }
      );
    }

    // Fetch students based on batchName
    const students = await prisma.studentDetails.findMany({
      where: {
        batchName: batchName,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        enrollmentNumber: true,
      },
      orderBy: {
        enrollmentNumber: 'asc',
      },
    });

    if (!students || students.length === 0) {
      return NextResponse.json(
        { message: 'No students found for this batch' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      students: students
    });

  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { message: 'Error fetching students' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}