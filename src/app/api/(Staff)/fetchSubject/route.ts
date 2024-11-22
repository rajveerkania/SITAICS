import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function GET(request: Request) {
  const decodedUser = verifyToken();
  if (!decodedUser) {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }
  const userRole = decodedUser.role;

  if (userRole !== "Staff") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    const staffId = decodedUser.id;

    const staffSubjects = await prisma.staffDetails.findUnique({
      where: { id: staffId },
      select: {
        subjects: {
          select: {
            subjectId: true,
            subjectName: true,
            subjectCode: true,
            semester: true,
            isElective: true,
            course: {
              select: {
                courseId: true,
                courseName: true,
              },
            },
            batches: {
              select: {
                batchId: true,
                batchName: true,
              },
            },
            electiveGroup: {
              select: {
                electiveGroupId: true,
                groupName: true,
                semester: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(staffSubjects?.subjects || []);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching subjects" },
      { status: 500 }
    );
  }
}