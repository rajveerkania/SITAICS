import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  const decodedUser = verifyToken();
  
  if (decodedUser?.role !== "Admin") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    const course = await prisma.course.findUnique({
      where: {
        courseId: params.courseId,
        isActive: true,
      },
    });

    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch course", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const decodedUser = verifyToken();
  
  if (decodedUser?.role !== "Admin") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    const data = await req.json();
    const { courseId, courseName } = data;

    // Validate required fields
    if (!courseId || !courseName) {
      return NextResponse.json(
        { message: "Course ID and name are required" },
        { status: 400 }
      );
    }

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: {
        courseId: courseId,
        isActive: true,
      },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { message: "Course not found or inactive" },
        { status: 404 }
      );
    }

    // Check if new course name already exists for another course
    const duplicateCourse = await prisma.course.findFirst({
      where: {
        courseName: courseName,
        courseId: {
          not: courseId,
        },
        isActive: true,
      },
    });

    if (duplicateCourse) {
      return NextResponse.json(
        { message: "Course name already exists" },
        { status: 400 }
      );
    }

    // Update the course
    const updatedCourse = await prisma.course.update({
      where: {
        courseId: courseId,
      },
      data: {
        courseName: courseName,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        message: "Course updated successfully",
        course: updatedCourse
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      {
        message: "Failed to update course",
        error: error.message
      },
      { status: 500 }
    );
  }
}