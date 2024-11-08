import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function POST(request: NextRequest) {
  const decodedUser = verifyToken();
  const userId = decodedUser?.id;
  const userRole = decodedUser?.role;

  // Only allow students to apply for leave
  if (userRole !== "Student") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    const reqBody = await request.json();
    const { type, startDate, endDate, reason } = reqBody;

    // Validation: Check if required fields are present
    if (!type || !startDate || !endDate || !reason) {
      return NextResponse.json(
        { error: "Please provide all required fields." },
        { status: 400 }
      );
    }

    const parsedStartDate = new Date(`${startDate}T00:00:00Z`);
    const parsedEndDate = new Date(`${endDate}T00:00:00Z`);

    // Check if the student exists in the database
    const studentRecord = await prisma.studentDetails.findUnique({
      where: { id: userId },
    });

    if (!studentRecord) {
      return NextResponse.json(
        { error: "Student record not found." },
        { status: 404 }
      );
    }

    // Create a new leave request in the Leave model
    const newLeave = await prisma.leave.create({
      data: {
        studentId: userId,
        leaveType: type,
        fromDate: parsedStartDate,
        toDate: parsedEndDate,
        reason,
        status: "Pending", // Default status is "Pending"
      },
    });

    return NextResponse.json({
      message: "Leave request submitted successfully",
      success: true,
      leave: newLeave,
    });
  } catch (error: any) {
    console.error("Error submitting leave request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
