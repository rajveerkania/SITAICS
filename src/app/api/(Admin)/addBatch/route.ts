import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { batchName, courseName, batchDuration, currentSemester, currentSemster } = body;

    // Check for typo in currentSemester
    const actualCurrentSemester = currentSemester || currentSemster;

    // Validate input
    const missingFields = [];
    if (!batchName) missingFields.push('batchName');
    if (!courseName) missingFields.push('courseName');
    if (!batchDuration) missingFields.push('batchDuration');
    if (!actualCurrentSemester) missingFields.push('currentSemester');

    if (missingFields.length > 0) {
      return NextResponse.json({ error: `Missing required fields: ${missingFields.join(', ')}` }, { status: 400 });
    }

    // Convert batchDuration to number
    const durationInYears = parseInt(batchDuration);
    if (isNaN(durationInYears)) {
      return NextResponse.json({ error: 'Invalid batch duration' }, { status: 400 });
    }

    // Convert currentSemester to number
    const semester = parseInt(actualCurrentSemester);
    if (isNaN(semester)) {
      return NextResponse.json({ error: 'Invalid semester' }, { status: 400 });
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { courseName },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if batch already exists
    const existingBatch = await prisma.batch.findFirst({
      where: { batchName, courseId: course.courseId },
    });

    if (existingBatch) {
      return NextResponse.json({ error: 'Batch already exists for this course' }, { status: 400 });
    }

    const batch = await prisma.batch.create({
      data: {
        batchName,
        courseId: course.courseId,
        batchDuration: durationInYears,
        currentSemester: semester,
      },
      include: {
        course: {
          select: {
            courseName: true
          }
        }
      }
    });

    return NextResponse.json(batch, { status: 201 });
  } catch (error) {
    console.error('Error adding batch:', error);
    return NextResponse.json({ error: 'Failed to add batch' }, { status: 500 });
  }
}