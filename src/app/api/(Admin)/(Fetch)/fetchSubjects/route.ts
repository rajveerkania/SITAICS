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

  if (userRole === "Admin") {
    try {
      const subjects = await prisma.subject.findMany({
        where: {
          isActive: true,
        },
        select: {
          subjectId: true,
          subjectName: true,
          subjectCode: true,
          semester: true,
          courseId: true,
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
        courseName: subject.course.courseName,
      }));

      return NextResponse.json(formattedSubjects, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { message: "Failed to fetch subjects" },
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}
