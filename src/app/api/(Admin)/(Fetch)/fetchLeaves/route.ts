import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;

  if (userRole !== "Admin" && userRole !== "Staff") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    const leaves = await prisma.leave.findMany({
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
            name: true,
            batchName: true,
            courseName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Optional: to order leaves by creation date
      },
    });

    return NextResponse.json({ leaves });
  } catch (error) {
    console.error("Error fetching leaves:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching leaves" },
      { status: 500 }
    );
  }
}
