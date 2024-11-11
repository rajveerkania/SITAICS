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
    // Fetch the staff details to check if they are a batch coordinator
    const staffDetails = await prisma.staffDetails.findUnique({
      where: { id: userId },
      select: { batchId: true, isBatchCoordinator: true },
    });

    if (!staffDetails || !staffDetails.batchId) {
      return NextResponse.json({ message: "Batch not found for the staff!" }, { status: 404 });
    }

    if (!staffDetails.isBatchCoordinator) {
      return NextResponse.json({ message: "Only batch coordinators can upload the timetable!" }, { status: 403 });
    }

    const batchId = staffDetails.batchId;

    // Check if a timetable already exists for the batch
    const existingBatch = await prisma.batch.findUnique({
      where: { batchId },
      select: { timetable: true },
    });

    if (existingBatch?.timetable) {
      return NextResponse.json({
        message: "Timetable already exists!",
        success: true,
        timetableExists: true,
        timetable: existingBatch.timetable.toString("base64"),
      });
    }

    // Get timetable file from the request
    const formData = await request.formData();
    const timetableFile = formData.get("timetable") as File;

    if (!timetableFile) {
      return NextResponse.json({ message: "No timetable file provided!" }, { status: 400 });
    }

    if (timetableFile.type !== "application/pdf") {
      return NextResponse.json({ message: "Only PDF files are allowed." }, { status: 400 });
    }

    const timetableBuffer = Buffer.from(await timetableFile.arrayBuffer());

    // Update the batch with the new timetable
    const updatedBatch = await prisma.batch.update({
      where: { batchId },
      data: {
        timetable: timetableBuffer,
      },
    });

    return NextResponse.json({
      message: "Timetable uploaded successfully!",
      success: true,
      updatedBatch,
    });
  } catch (error: any) {
    console.error("Error uploading timetable:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
