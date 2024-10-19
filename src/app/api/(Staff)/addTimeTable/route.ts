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

    console.log(staffDetails);

    if (!staffDetails || !staffDetails.batchId) {
      return NextResponse.json({ message: "Batch not found for the staff!" }, { status: 404 });
    }

    const batchId = staffDetails.batchId;

    // Fetch the batch and check if the timetable already exists
    const existingBatch = await prisma.batch.findUnique({
      where: { batchId },
      select: { timetable: true },
    });

    if (existingBatch?.timetable) {
      // If timetable already exists, return it
      return NextResponse.json({
        message: "Timetable already exists!",
        success: true,
        timetableExists: true,
        timetable: existingBatch.timetable.toString("base64"), // Sending as base64 to view it as a PDF
      });
    }

    // If no timetable exists, process the upload
    const formData = await request.formData();
    const timetableFile = formData.get("timetable") as File;

    if (!timetableFile) {
      return NextResponse.json({ message: "No timetable file provided!" }, { status: 400 });
    }

    // Validate if file is PDF
    if (timetableFile.type !== "application/pdf") {
      return NextResponse.json({ message: "Only PDF files are allowed." }, { status: 400 });
    }

    // Convert the file to a buffer
    const timetableBuffer = Buffer.from(await timetableFile.arrayBuffer());

    // Update the batch with the timetable PDF file
    const updatedBatch = await prisma.batch.update({
      where: { batchId },
      data: {
        timetable: timetableBuffer, // Assign the buffer to the timetable field
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
