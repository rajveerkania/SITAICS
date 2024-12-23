// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
// import { verifyToken } from '@/utils/auth';
// import { AttendanceType, Role } from '@prisma/client';

// export async function PUT(request: NextRequest) {
//   try {
//     // Verify user authentication and role
//     const decodedUser = verifyToken();
//     if (!decodedUser?.id) {
//       return NextResponse.json(
//         { success: false, message: 'Unauthorized access' },
//         { status: 401 }
//       );
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: decodedUser.id },
//       select: { role: true }
//     });

//     // Check if user is admin or staff
//     if (user?.role !== Role.Admin && user?.role !== Role.Staff) {
//       return NextResponse.json(
//         { success: false, message: 'Access denied' },
//         { status: 403 }
//       );
//     }

//     // Parse request body
//     const body = await request.json();
//     const { date, studentId, subjectId, batchId, type, isPresent } = body;

//     // Validate input
//     if (!date || !studentId || !subjectId || !batchId || !type) {
//       return NextResponse.json(
//         { success: false, message: 'Missing required fields' },
//         { status: 400 }
//       );
//     }

//     // Check if attendance record exists
//     const existingAttendance = await prisma.attendance.findFirst({
//       where: {
//         studentId,
//         subjectId,
//         batchId,
//         date: new Date(date),
//         type
//       }
//     });

//     if (!existingAttendance) {
//       // Create new attendance record if not exists
//       const newAttendance = await prisma.attendance.create({
//         data: {
//           studentId,
//           subjectId,
//           batchId,
//           date: new Date(date),
//           type,
//           isPresent,
//           staffId: decodedUser.id // Use the logged-in staff/admin's ID
//         }
//       });

//       return NextResponse.json({
//         success: true,
//         message: 'Attendance record created',
//         data: newAttendance
//       }, { status: 201 });
//     }

//     // Update existing attendance record
//     const updatedAttendance = await prisma.attendance.update({
//       where: { id: existingAttendance.id },
//       data: { 
//         isPresent,
//         updatedAt: new Date()
//       }
//     });

//     return NextResponse.json({
//       success: true,
//       message: 'Attendance updated successfully',
//       data: updatedAttendance
//     });

//   } catch (error) {
//     console.error('Attendance update error:', error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         message: 'Failed to update attendance' 
//       }, 
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/utils/auth';
import { AttendanceType, Role } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    // Verify user token and check role
    const decodedUser = verifyToken();
    if (!decodedUser || decodedUser.role !== Role.Admin) {
      return NextResponse.json(
        { success: false, message: 'Access Denied. Admin only.' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    console.log('Received attendance update request:', body);

    // Validate inputs
    const requiredFields = ['date', 'studentId', 'subjectId', 'type', 'isPresent'];
    const missingFields = requiredFields.filter(field => body[field] === undefined);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const { date, studentId, subjectId, type, isPresent } = body;

    // Validate attendance type
    if (!Object.values(AttendanceType).includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid attendance type' },
        { status: 400 }
      );
    }

    // Ensure date is valid
    const attendanceDate = new Date(date);
    if (isNaN(attendanceDate.getTime())) {
      return NextResponse.json(
        { success: false, message: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Find existing attendance record
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        date: attendanceDate,
        type,
        subjectId,
        studentId,
      }
    });

    if (!existingAttendance) {
      return NextResponse.json(
        { success: false, message: 'Attendance record not found' },
        { status: 404 }
      );
    }

    // Update the existing record
    const updatedAttendance = await prisma.attendance.update({
      where: { id: existingAttendance.id },
      data: {
        isPresent,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Attendance updated successfully',
        attendance: updatedAttendance
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Attendance update error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update attendance', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

