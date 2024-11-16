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
    // Fetch subjects assigned to the staff member from BatchSubject and Subject tables
    const subjects = await prisma.batchSubject.findMany({
      where: {
        staffId: staffId, // filter by staffId in the BatchSubject table
      },
      select: {
        subject: { // select the subject data from the Subject table
          select: {
            subjectName: true,
            subjectId: true,
          },
        },
      },
    });

    // Check if any subjects are found
    if (subjects.length === 0) {
      return NextResponse.json(
        { message: 'No subjects found for this staff member' },
        { status: 404 }
      );
    }

    // Extract subject names
    const subjectNames = subjects.map((subject) => subject.subject.subjectName);

    // Return the list of subject names
    return NextResponse.json({
        success: true,
        subjects: subjects.map(subject => ({
          subjectId: subject.subject.subjectId, // Assuming there's an ID field
          subjectName: subject.subject.subjectName
        }))
      });
  } catch (error) {
    console.error('Error fetching subjects:', error);

    // Return a 500 Internal Server Error response
    return NextResponse.json(
      { message: 'Error fetching subjects' },
      { status: 500 }
    );
  } finally {
    // Ensure Prisma client disconnects
    await prisma.$disconnect();
  }
}
