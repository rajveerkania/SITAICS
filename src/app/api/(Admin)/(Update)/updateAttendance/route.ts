import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/utils/auth';

export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { attendanceId, isPresent } = body;

    // Update the attendance record
    const updatedAttendance = await prisma.attendance.update({
      where: {
        id: attendanceId
      },
      data: {
        isPresent: isPresent
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedAttendance
    });

  } catch (error) {
    console.error('Error updating attendance:', error);
    return NextResponse.json(
      { success: false, message: 'Error updating attendance' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}