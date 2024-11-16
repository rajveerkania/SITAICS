import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/utils/auth';

export async function GET() {
  // Assuming the staffId is provided as a query parameter
  const decodedUser = verifyToken();
  const staffId = decodedUser?.id;

  if (!staffId) {
    return NextResponse.json(
      { message: 'Staff ID is required' },
      { status: 400 }
    );
  }

  try {
    // Fetch the total number of subjects taught by the staff member
    const totalSubjects = await prisma.batchSubject.count({
      where: {
        staffId: staffId,  
      },
    });

    // // Debugging: Log the total number of subjects
    console.log('Total Subjects:', totalSubjects);

    // Return the total number of subjects in the response
    return NextResponse.json({ totalSubjects });
  } catch (error) {
    console.error('Error fetching total subjects:', error);

    // Return a 500 Internal Server Error response with an error message
    return NextResponse.json(
      { message: 'Error fetching total subjects' },
      { status: 500 }
    );
  } finally {
    // Ensure the Prisma client is properly disconnected
    await prisma.$disconnect();
  }
}
