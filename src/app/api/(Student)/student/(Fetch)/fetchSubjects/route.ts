import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function GET(req: Request) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;

  if (userRole !== "Student") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { error: "studentId is required" },
        { status: 400 }
      );
    }

    const studentWithSubjects = await prisma.studentDetails.findUnique({
      where: {
        id: studentId,
      },
      select: {
        batch: {
          select: {
            subjects: {
              select: {
                subject: {
                  select: {
                    subjectId: true,
                    subjectName: true,
                    subjectCode: true,
                    semester: true,
                    isActive: true,
                  },
                },
                semester: true,
              },
            },
          },
        },
      },
    });

    if (!studentWithSubjects || !studentWithSubjects.batch) {
      return NextResponse.json(
        { error: "No subjects found for this student" },
        { status: 404 }
      );
    }

    const subjects = studentWithSubjects.batch.subjects.map((batchSubject) => ({
      ...batchSubject.subject,
      semester: batchSubject.semester,
    }));

    return NextResponse.json({ subjects });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
