import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;

  if (userRole !== "Student") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { error: "studentId is required" },
        { status: 400 }
      );
    }

    // Step 1: Fetch the number of leaves applied by the student
    const leaveCount = await prisma.leave.count({
      where: {
        studentId: studentId,
      },
    });

    // Step 2: Return the result
    return NextResponse.json({
      studentId,
      leaveCount,
    });
  } catch (error) {
    console.error("Error fetching leave count:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the leave count" },
      { status: 500 }
    );
  }
}
