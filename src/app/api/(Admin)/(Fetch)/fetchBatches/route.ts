import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;

  // if (!["Admin", "Staff"].includes(userRole!)) {
  //   return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  // }

  try {
    const batches = await prisma.batch.findMany({
      where: { isActive: true },
      include: {
        course: {
          select: {
            courseName: true,
          },
        },
        students: true,
      },
    });

    const formattedBatches = batches.map((batch) => ({
      batchId: batch.batchId,
      batchName: batch.batchName,
      courseName: batch.course.courseName,
      batchDuration: batch.batchDuration,
      currentSemester: batch.currentSemester,
      studentCount: batch.students.length,
    }));

    return NextResponse.json(formattedBatches, { status: 200 });
  } catch (error) {
    console.error("Error fetching batches:", error);
    return NextResponse.json(
      { error: "Failed to fetch batches" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
