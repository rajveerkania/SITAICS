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
    const { subjectName, subjectCode, semester, courseId: providedCourseId } = await req.json();

    if (!subjectName || !subjectCode || !semester || !providedCourseId) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const semesterInt = parseInt(semester, 10);
    if (isNaN(semesterInt)) {
      return NextResponse.json(
        { message: "Semester must be a valid number" },
        { status: 400 }
      );
    }

    let course = await prisma.course.findUnique({
      where: { courseId: providedCourseId },
    });

    if (!course) {
      course = await prisma.course.findUnique({
        where: { courseName: providedCourseId },
      });

      if (!course) {
        return NextResponse.json(
          { message: "Course not found. Please check the course ID or name." },
          { status: 404 }
        );
      }
    }

    const existingSubject = await prisma.subject.findFirst({
      where: { 
        subjectName,
        subjectCode,
        courseId: course.courseId
      },
    });

    if (existingSubject) {
      return NextResponse.json(
        { message: "Subject already exists for this course" },
        { status: 400 }
      );
    }

    const subject = await prisma.subject.create({
      data: {
        subjectName,
        subjectCode,
        semester: semesterInt,
        courseId: course.courseId,
        isActive: true,
      },
    });

    return NextResponse.json(subject,   {status: 200} );
  } catch (error:any) {
    console.error("Error adding subject:", error);
    return NextResponse.json(
      { message: "An error occurred while adding the subject", error: error.message },
      { status: 500 }
    );
  }
}