
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
    // Fetch subjects and related batch information assigned to the staff member
    const subjectsWithBatches = await prisma.batchSubject.findMany({
      where: {
        staffId: staffId,
      },
      select: {
        subject: {
          select: {
            subjectId: true,
            subjectName: true,
          },
        },
        batch: {
          select: {
            batchId: true,
            batchName: true,
          },
        },
      },
    });

    if (subjectsWithBatches.length === 0) {
      return NextResponse.json(
        { message: 'No subjects found for this staff member' },
        { status: 404 }
      );
    }

    // Transform the data to include combined subject-batch information
    const formattedSubjects = subjectsWithBatches.map(item => ({
      subjectId: item.subject.subjectId,
      batchId: item.batch.batchId,
      displayName: `${item.subject.subjectName} - ${item.batch.batchName}`,
      subjectName: item.subject.subjectName,
      batchName: item.batch.batchName
    }));

    return NextResponse.json({
      success: true,
      subjects: formattedSubjects
    });

  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json(
      { message: 'Error fetching subjects' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}