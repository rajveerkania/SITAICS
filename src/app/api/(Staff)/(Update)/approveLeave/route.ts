import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function POST(request: NextRequest) {
  const { leaveId } = await request.json();

  // Verify the token and check the user's role
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;
  const staffId = decodedUser?.id;

  if (userRole !== "Staff") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    // Find the leave request by ID
    const leaveRequest = await prisma.leave.update({
      where: { id: leaveId },
      data: { status: "Approved" },
    });

    if (!leaveRequest) {
      return NextResponse.json({ message: "Leave request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Leave approved" });
  } catch (error) {
    console.error("Error approving leave:", error);
    return NextResponse.json({ error: "An error occurred while approving the leave" }, { status: 500 });
  }
}
