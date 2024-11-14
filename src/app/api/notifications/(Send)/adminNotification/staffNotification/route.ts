import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;

  if (userRole !== "Staff") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {

    const subjects = await prisma.subject.findMany({
      where: { isActive: true },
      include: {
        course: {
          select: {
            courseName: true,
          },
        },
        batches: {
          select: {
            batch: {
              select: {
                batchId: true,
                batchName: true,
              },
            },
          },
        }, 
      },
    });

    const formattedSubjects = subjects.map((subject) => ({
      subjectId: subject.subjectId,  // Ensure subjectId exists in Prisma model
      subjectName: subject.subjectName,
      subjectCode: subject.subjectCode,
      semester: subject.semester,
      courseName: subject.course.courseName,
      isElective: subject.isElective,
      batches: subject.batches.map((batch) => ({
        batchId: batch.batch.batchId,
        batchName: batch.batch.batchName,
      })),
    }));

    return NextResponse.json(formattedSubjects, { status: 200 });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}