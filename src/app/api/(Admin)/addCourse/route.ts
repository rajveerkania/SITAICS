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
    const { courseName } = await req.json();

    // Check if course already exists
    const existingCourse = await prisma.course.findUnique({
      where: { courseName },
    });

    if (existingCourse) {
      return NextResponse.json(
        { error: "Course already exists" },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: { courseName },
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
