import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/utils/auth';

export async function GET() {
  // Decode the user token to get the staff ID
  const decodedUser = verifyToken();
  const staffId = decodedUser?.id;

  if (!staffId) {
    return NextResponse.json(
      { message: 'Staff ID is required' },
      { status: 400 }
    );
  }

  try {
    // Fetch the staff's batch coordinator status from the database
    const staffMember = await prisma.staffDetails.findUnique({
      where: {
        id: staffId, // Assuming staffId is a string and exists in the staff table
      },
      select: {
        isBatchCoordinator: true, // Assuming there's a field `isBatchCoordinator` to check
      },
    });

    if (!staffMember) {
      return NextResponse.json(
        { message: 'Staff member not found' },
        { status: 404 }
      );
    }

    // Return the batch coordinator status
    return NextResponse.json({
      isBatchCoordinator: staffMember.isBatchCoordinator,
    });
  } catch (error) {
    console.error('Error fetching batch coordinator status:', error);

    // Return a 500 Internal Server Error response
    return NextResponse.json(
      { message: 'Error fetching batch coordinator status' },
      { status: 500 }
    );
  } finally {
    // Ensure Prisma client disconnects
    await prisma.$disconnect();
  }
}
