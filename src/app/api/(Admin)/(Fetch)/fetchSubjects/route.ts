import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;

  if (!["Admin", "Staff"].includes(userRole!)) {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    const subjects = await prisma.subject.findMany({
      select: {
        subjectId: true,
        subjectName: true,
        subjectCode: true,
        semester: true,
        course: {
          select: {
            courseName: true,
          },
        },
      },
    });
    const formattedSubjects = subjects.map((subject) => ({
      subjectId: subject.subjectId,
      subjectName: subject.subjectName,
      subjectCode: subject.subjectCode,
      semester: subject.semester,
      courseName: subject.course?.courseName || "N/A",
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
