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
    const { subjectName, subjectCode, semester, courseId, batchId } =
      await req.json();

    // Check if subject already exists for the course
    const existingSubject = await prisma.subject.findFirst({
      where: { subjectName, subjectCode, courseId },
    });

    if (existingSubject) {
      return NextResponse.json(
        { error: "Subject already exists for this course" },
        { status: 400 }
      );
    }

    const subject = await prisma.subject.create({
      data: {
        subjectName,
        subjectCode,
        semester,
        courseId,
      },
    });

    if (batchId) {
      // Check if batch exists and get its current semester
      const batch = await prisma.batch.findUnique({
        where: { batchId },
      });

      if (!batch) {
        return NextResponse.json({ error: "Batch not found" }, { status: 404 });
      }

      // Add subject to the batch's current semester
      await prisma.batchSubject.create({
        data: {
          batchId,
          subjectId: subject.subjectId,
          semester: batch.currentSemester,
        },
      });
    }

    return NextResponse.json(subject, { status: 201 });
  } catch (error) {
    console.error("Error adding subject:", error);
    return NextResponse.json(
      { error: "Failed to add subject" },
      { status: 500 }
    );
  }
}
