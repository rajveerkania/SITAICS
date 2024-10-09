import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function POST(req: Request) {
  try {
    const decodedUser = verifyToken();
    const userRole = decodedUser?.role;

    if (userRole !== "Admin") {
      return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
    }

    const body = await req.json();
    const { groupName, courseName, semester } = body;

    if (!groupName || !courseName || !semester) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: {
        courseName: courseName,
      },
      select: {
        courseId: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 406 }
      );
    }

    const courseId = course.courseId;

    const existingGroup = await prisma.electiveGroup.findFirst({
      where: {
        groupName: groupName,
        courseId: courseId,
        semester: Number(semester),
      },
    });

    if (existingGroup) {
      return NextResponse.json(
        { message: "Group already exists" },
        { status: 409 }
      );
    }

    const electiveGroup = await prisma.electiveGroup.create({
      data: {
        groupName,
        courseId,
        semester: Number(semester),
      },
    });

    return NextResponse.json(
      { message: "Group added successfully", electiveGroup },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating elective group:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
