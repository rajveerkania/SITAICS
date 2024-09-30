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

    // Validate required fields
    if (!subjectName || !subjectCode || !semester || !providedCourseId) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Ensure the semester is an integer
    const semesterInt = parseInt(semester, 10);
    if (isNaN(semesterInt)) {
      return NextResponse.json(
        { error: "Semester must be a valid number" },
        { status: 400 }
      );
    }

    // Check if the course exists
    let course = await prisma.course.findUnique({
      where: { courseId: providedCourseId },
    });

    if (!course) {
      // If course is not found by ID, try to find it by name
      course = await prisma.course.findUnique({
        where: { courseName: providedCourseId },
      });

      if (!course) {
        return NextResponse.json(
          { error: "Course not found. Please check the course ID or name." },
          { status: 404 }
        );
      }
    }

    // Check if subject already exists for the course
    const existingSubject = await prisma.subject.findFirst({
      where: { 
        subjectName,
        subjectCode,
        courseId: course.courseId
      },
    });

    if (existingSubject) {
      return NextResponse.json(
        { error: "Subject already exists for this course" },
        { status: 400 }
      );
    }

    // Create the new subject
    const subject = await prisma.subject.create({
      data: {
        subjectName,
        subjectCode,
        semester: semesterInt,
        courseId: course.courseId,
        isActive: true,
      },
    });

    return NextResponse.json(subject, { status: 201 });
  } catch (error:any) {
    console.error("Error adding subject:", error);
    return NextResponse.json(
      { message: "An error occurred while adding the subject", error: error.message },
      { status: 500 }
    );
  }
}