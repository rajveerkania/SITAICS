import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseName } = body;

    if (!courseName) {
      return NextResponse.json(
        { error: "Course name is required" },
        { status: 400 }
      );
    }

    const course = await prisma.course.findFirst({
      where: {
        courseName: {
          contains: courseName,
          mode: "insensitive",
        },
      },
      include: {
        batches: {
          select: {
            batchName: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { message: "Course not found", searchedFor: courseName },
        { status: 404 }
      );
    }

    const batchNames = course.batches.map(
      (batch: { batchName: any }) => batch.batchName
    );

    return NextResponse.json({ courseName: course.courseName, batchNames });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
