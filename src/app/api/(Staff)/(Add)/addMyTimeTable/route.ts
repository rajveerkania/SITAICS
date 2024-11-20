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
    const contentType = request.headers.get("content-type") || "";

    // Case 1: Fetch timetable if no file is provided in form-data
    if (!contentType.includes("multipart/form-data")) {
      const staffDetails = await prisma.staffDetails.findUnique({
        where: { id: userId },
        select: { timetable: true, isBatchCoordinator: true },
      });

      if (staffDetails?.timetable) {
        return NextResponse.json({
          timetableExists: true,
          timetable: staffDetails.timetable.toString("base64"),
          success: true,
        });
      } else {
        return NextResponse.json({ timetableExists: false });
      }
    }

    // Case 2: Upload a new timetable if form-data is detected
    const formData = await request.formData();
    const timetableFile = formData.get("timetable") as File;

    if (!timetableFile) {
      return NextResponse.json({ message: "No timetable file provided!" }, { status: 400 });
    }

    if (timetableFile.type !== "application/pdf") {
      return NextResponse.json({ message: "Only PDF files are allowed." }, { status: 400 });
    }

    const timetableBuffer = Buffer.from(await timetableFile.arrayBuffer());
    const updatedStaffDetails = await prisma.staffDetails.update({
      where: { id: userId },
      data: { timetable: timetableBuffer },
    });

    return NextResponse.json({
      message: "Timetable uploaded successfully!",
      success: true,
      updatedStaffDetails,
    });
  } catch (error: any) {
    console.error("Error uploading timetable:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
