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
      where: { staffId },
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

    if (subjects.length === 0) {
      return NextResponse.json(
        { message: 'No subjects found for this staff member' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      subjects: subjects.map((entry) => ({
        subjectId: entry.subject.subjectId,
        subjectName: entry.subject.subjectName,
        batchId: entry.batch.batchId,
        batchName: entry.batch.batchName,
      })),
    });
  } catch (error) {
    console.error('Error fetching subjects and batches:', error);
    return NextResponse.json(
      { message: 'Error fetching subjects and batches' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

