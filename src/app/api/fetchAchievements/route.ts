// api/achievements/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
  const decodedUser = verifyToken();
  const userId = decodedUser?.id;

  if (!userId) {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    const staffDetails = await prisma.staffDetails.findUnique({
      where: { id: userId },
    });

    if (!staffDetails) {
      return NextResponse.json({ error: "Staff details not found!" }, { status: 404 });
    }

    // Parse the achievements if they are stored as a JSON string
    const achievements = staffDetails.achievements ? JSON.parse(staffDetails.achievements) : [];

    return NextResponse.json({ achievements });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
  }
}
