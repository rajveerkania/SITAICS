import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/utils/auth';
export async function GET() {
  const decodedUser = verifyToken();
  const staffId = decodedUser?.id;

  if (!staffId) {
    return NextResponse.json(
      { message: 'Staff ID is required' },
      { status: 400 }
    );
  }

  try {
    const subjects = await prisma.batchSubject.findMany({
      where: {
        staffId: staffId, // filter by staffId in the BatchSubject table
      },
      select: {
        subject: { // select the subject data from the Subject table
          select: {
            subjectName: true,
          },
        },
      },
    });
 if (subjects.length === 0) {
      return NextResponse.json(
        { message: 'No subjects found for this staff member' },
        { status: 404 }
      );
    }
    const subjectNames = subjects.map((subject) => subject.subject.subjectName);
    return NextResponse.json({
      subjectNames,
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