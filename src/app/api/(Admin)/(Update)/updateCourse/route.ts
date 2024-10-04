import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function PUT(req: Request) {
  const decodedUser = verifyToken();

  if (decodedUser?.role !== "Admin") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    const { courseId, courseName } = await req.json();

    const updatedCourse = await prisma.course.update({
      where: {
        courseId: courseId,
      },
      data: {
        courseName: courseName,
      },
    });

    return NextResponse.json(
      { message: "Course updated successfully", course: updatedCourse },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update course", error: error.message },
      { status: 500 }
    );
  }
}