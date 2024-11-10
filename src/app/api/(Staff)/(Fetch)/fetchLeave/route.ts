import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
  // Verify the token and check the user's role
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;
  const staffId = decodedUser?.id;

  // Only allow staff members to access this endpoint
  if (userRole !== "Staff") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    // Step 1: Get the batch ID for the staff member
    const staffDetails = await prisma.staffDetails.findUnique({
      where: { id: staffId },
      select: { batchId: true }
    });

    if (!staffDetails?.batchId) {
      return NextResponse.json(
        { message: "Batch not assigned to the staff member" },
        { status: 404 }
      );
    }

    const batchId = staffDetails.batchId;

    // Step 2: Fetch the batch name using the batch ID
    const batch = await prisma.batch.findUnique({
      where: { batchId },
      select: { batchName: true }
    });

    if (!batch?.batchName) {
      return NextResponse.json(
        { message: "Batch not found" },
        { status: 404 }
      );
    }

    const batchName = batch.batchName;

    // Step 3: Fetch all students in that batch
    const students = await prisma.studentDetails.findMany({
      where: { batchName },
      select: { id: true }
    });

    const studentIds = students.map(student => student.id);

    // Step 4: Get leave requests made by these students with student name
    const leaveRequests = await prisma.leave.findMany({
      where: { studentId: { in: studentIds } },
      select: {
        id: true,
        studentId: true,
        leaveType: true,
        fromDate: true,
        toDate: true,
        reason: true,
        status: true,
        student: {
          select: {
            name: true, // Fetch the student's name
          },
        },
      },
    });

    if (!leaveRequests.length) {
      return NextResponse.json({ message: "No leave requests found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      leaves: leaveRequests.map((leave) => ({
        ...leave,
        studentName: leave.student?.name, // Include student's name in each leave request
      })),
    });
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching leave requests" },
      { status: 500 }
    );
  }
}
