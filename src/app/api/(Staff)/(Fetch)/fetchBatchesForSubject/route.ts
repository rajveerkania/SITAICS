import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get('subjectId');

    if (!subjectId) {
      return NextResponse.json(
        { success: false, message: 'Subject ID is required' },
        { status: 400 }
      );
    }

    // Fetch batches related to the given subjectId
    const batches = await prisma.batchSubject.findMany({
      where: { subjectId },
      select: {
        batch: {
          select: {
            batchId: true,
            batchName: true,
          },
        },
      },
    });

    const batchList = batches.map((item) => item.batch);

    return NextResponse.json({ success: true, batches: batchList });
  } catch (error) {
    console.error('Error fetching batches:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch batches' },
      { status: 500 }
    );
  }
}
