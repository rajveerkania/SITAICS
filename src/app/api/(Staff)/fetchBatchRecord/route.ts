import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
  try {
    // Verify the user's token and get their ID and role
    const decodedUser = verifyToken();
    const userRole = decodedUser?.role;
    const userId = decodedUser?.id;

    // Check if the user is a staff member
    if (userRole !== "Staff") {
      return NextResponse.json(
        { message: "Access Denied! Only staff members can access this endpoint." },
        { status: 403 }
      );
    }

    // Get all BatchSubjects where the staff is teaching
    const batchSubjects = await prisma.batchSubject.findMany({
      where: {
        staffId: userId,
      },
      select: {
        batch: {
          select: {
            batchName: true,
          },
        },
      },
      distinct: ['batchId'], // To avoid duplicate batch names
    });

    // Extract only the batch names
    const batchNames = batchSubjects.map(bs => bs.batch.batchName);

    return NextResponse.json({
      success: true,
      batchNames: batchNames
    });
  } catch (error) {
    console.error("Error fetching staff batches:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}