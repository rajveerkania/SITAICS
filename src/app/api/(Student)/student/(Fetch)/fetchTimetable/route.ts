import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function POST(request: NextRequest) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;
  const userId = decodedUser?.id;

  if (userRole !== "Student") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    // Fetch the batch name from the student details
    const studentDetails = await prisma.studentDetails.findUnique({
      where: { id: userId },
      select: { batchName: true },
    });
    console.log(studentDetails)
    if (!studentDetails || !studentDetails.batchName) {
      return NextResponse.json({ message: "Batch not found for the student!" }, { status: 404 });
    }

    const batchName = studentDetails.batchName;

    // Fetch the batch and check if the timetable exists
    const existingBatch = await prisma.batch.findUnique({
      where: { batchName },
      select: { timetable: true },
    });

    if (existingBatch?.timetable) {
      // If timetable exists, return it
      return NextResponse.json({
        message: "Timetable fetched successfully!",
        success: true,
        timetableExists: true,
        timetable: existingBatch.timetable.toString("base64"), // Sending as base64 to view it as a PDF
      });
    }

    return NextResponse.json({ message: "Timetable not found!" }, { status: 404 });
  } catch (error: any) {
    console.error("Error fetching timetable:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
