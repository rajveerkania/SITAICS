import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";
import { v4 as uuidv4 } from 'uuid'; // UUID import

export async function POST(request: NextRequest) {
  const decodedUser = verifyToken(); // Verify the token to get user details
  const userRole = decodedUser?.role;
  const userId = decodedUser?.id;

  if (userRole !== "Student") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const semester = parseInt(formData.get("semester") as string, 10);
    const resultFile = formData.get("result") as File;
    const isRepeater = formData.get("isRepeater") === "true";

    if (!semester || !resultFile) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    if (resultFile.type !== "application/pdf") {
      return NextResponse.json({ message: "Only PDF files are allowed." }, { status: 400 });
    }

    const resultBuffer = Buffer.from(await resultFile.arrayBuffer());

    const studentDetails = await prisma.studentDetails.findUnique({
      where: { id: userId },
    });

    if (!studentDetails) {
      return NextResponse.json({ message: "Student not found!" }, { status: 404 });
    }

    const result = await prisma.result.create({
      data: {
        id: uuidv4(),
        studentId: studentDetails.id,
        semester: semester,
        resultFile: resultBuffer,
        isRepeater: isRepeater,
      },
    });

    return NextResponse.json({
      message: "Result uploaded successfully!",
      success: true,
      result,
    });
  } catch (error: any) {
    console.error("Error uploading result:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
