import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request:NextRequest) {
  try {
    const { courseId } = await request.json();

    const updatedCourse = await prisma.course.update({
      where: { courseId },
      data: { isActive: false },  // Mark course as inactive instead of deleting
    });

    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
