import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function POST(req: Request) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;

  if (userRole !== "Admin") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    const { courseName, courseDuration } = await req.json();

    if (!courseName || courseDuration === undefined) {
      return NextResponse.json(
        { error: "Course name and duration are required" },
        { status: 401 }
      );
    }

    const existingCourse = await prisma.course.findUnique({
      where: { courseName },
    });

    if (existingCourse) {
      return NextResponse.json(
        { error: "Course already exists" },
        { status: 403 }
      );
    }

    const course = await prisma.course.create({
      data: { courseName, duration: parseInt(courseDuration, 10) },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("Error adding course:", error);
    return NextResponse.json(
      { error: "Failed to add course" },
      { status: 500 }
    );
  }
}
