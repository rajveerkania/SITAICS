import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function GET() {
  const decodedUser = verifyToken();

  if (decodedUser?.role !== "Admin") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    const courses = await prisma.course.findMany({
      include: {
        batches: {
          select: {
            batchId: true,
            batchDuration: true,
          },
        },
        subjects: {
          select: {
            subjectId: true,
          },
        },
      },
    });

    const formattedCourses = courses.map((course) => ({
      courseId: course.courseId,
      courseName: course.courseName,
      totalBatches: course.batches.length,
      totalSubjects: course.subjects.length,
    }));

    return NextResponse.json(
      { message: "Courses fetched", courses: formattedCourses },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch courses", error: error.message },
      { status: 500 }
    );
  }
}
