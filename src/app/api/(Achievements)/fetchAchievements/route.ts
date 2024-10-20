import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;
  const userId = decodedUser?.id;

  if (userRole !== "Staff") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    // Fetch the staff details including achievements
    const staffDetails = await prisma.staffDetails.findUnique({
      where: { id: userId },
      select: { achievements: true },
    });

    if (!staffDetails) {
      return NextResponse.json({ message: "Staff not found!" }, { status: 404 });
    }

    // Ensure achievements are returned as an array (even if null or empty)
    const achievements = staffDetails.achievements ? staffDetails.achievements : [];

    // Send the achievements array back to the client
    return NextResponse.json({
      success: true,
      achievements: achievements,
    });
  } catch (error: any) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
