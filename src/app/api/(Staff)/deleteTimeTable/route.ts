import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function POST(request: NextRequest) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;
  const userId = decodedUser?.id;

  if (userRole !== "Staff") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    // Fetch staff details to get the batchId
    const staffDetails = await prisma.staffDetails.findUnique({
      where: { id: userId },
      select: { batchId: true },
    });

    if (!staffDetails || !staffDetails.batchId) {
      return NextResponse.json({ message: "Batch not found for the staff!" }, { status: 404 });
    }

    const batchId = staffDetails.batchId;

    // Fetch the batch to check if the timetable exists
    const existingBatch = await prisma.batch.findUnique({
      where: { batchId },
      select: { timetable: true },
    });

    if (!existingBatch?.timetable) {
      return NextResponse.json({
        message: "No timetable found to delete!",
        success: false,
      });
    }

    // Update the batch to remove the timetable (set it to null)
    await prisma.batch.update({
      where: { batchId },
      data: {
        timetable: null, // Set the timetable field to null to delete it
      },
    });

    return NextResponse.json({
      message: "Timetable deleted successfully!",
      success: true,
    });
  } catch (error: any) {
    console.error("Error deleting timetable:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
