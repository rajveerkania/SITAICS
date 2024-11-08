import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function POST(req: Request) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;

  if (userRole !== "Student") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { batchName } = body;

    if (!batchName) {
      return NextResponse.json(
        { message: "Missing required field: batchName", success: false },
        { status: 400 }
      );
    }

    const studentDetails = await prisma.studentDetails.findUnique({
      where: { id: decodedUser?.id },
      select: { isSemesterUpdated: true },
    });

    if (studentDetails?.isSemesterUpdated === false) {
      return NextResponse.json(
        {
          message: "Electives already chosen",
          required: false,
          success: false,
        },
        { status: 400 }
      );
    }

    const batch = await prisma.batch.findUnique({
      where: { batchName },
      select: { courseId: true, currentSemester: true },
    });

    if (!batch) {
      return NextResponse.json(
        { message: "Batch not found", success: false },
        { status: 404 }
      );
    }

    const electiveGroups = await prisma.electiveGroup.findMany({
      where: {
        courseId: batch.courseId,
        semester: batch.currentSemester,
        isActive: true,
      },
      select: {
        electiveGroupId: true,
        groupName: true,
        subjects: {
          where: { isActive: true },
          select: {
            subjectId: true,
            subjectName: true,
          },
        },
      },
    });

    if (electiveGroups.length === 0) {
      return NextResponse.json({
        message: "No elective groups found for this course",
        required: false,
        success: true,
      });
    }

    return NextResponse.json(
      {
        electiveGroups,
        message: "Elective groups for the course are present",
        required: true,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching elective groups:", error);
    return NextResponse.json(
      { message: "Failed to fetch elective groups", success: false },
      { status: 500 }
    );
  }
}
