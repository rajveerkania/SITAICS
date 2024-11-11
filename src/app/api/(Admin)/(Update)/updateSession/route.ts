import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function POST(request: Request) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;

  if (userRole !== "Admin") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    await prisma.studentDetails.updateMany({
      data: {
        isSemesterUpdated: true,
      },
    });

    await prisma.staffDetails.updateMany({
      data: {
        isSemesterUpdated: true,
      },
    });

    const batches = await prisma.batch.findMany();
    for (const batch of batches) {
      const course = await prisma.course.findUnique({
        where: {
          courseId: batch.courseId,
        },
      });

      if (course) {
        let newSemester;

        newSemester = batch.currentSemester + 1;

        const maxSemester = course.duration * 2;
        const isActive = newSemester <= maxSemester;
        newSemester = Math.min(newSemester, maxSemester);

        await prisma.batch.update({
          where: {
            batchId: batch.batchId,
          },
          data: {
            currentSemester: newSemester,
            isActive: isActive,
            timetable: null,
          },
        });
      }
    }

    return NextResponse.json(
      { message: "Academic session updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating academic session:", error);
    return NextResponse.json(
      { error: "Failed to update academic session" },
      { status: 500 }
    );
  }
}
