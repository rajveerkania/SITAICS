import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
  // Verify the token and check the user's role
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;
  const userId = decodedUser?.id;

  if (userRole !== "Student") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
 
    // Fetch all leave requests for the given student ID
    const leaveRequests = await prisma.leave.findMany({
      where: { studentId : userId },
      select: {
        id: true,
        leaveType: true,
        fromDate: true,
        toDate: true,
        reason: true,
        status: true,
      },
    });

    if (!leaveRequests) {
      return NextResponse.json({ message: "No leave requests found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, leaves: leaveRequests });
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching leave requests" },
      { status: 500 }
    );
  }
}
