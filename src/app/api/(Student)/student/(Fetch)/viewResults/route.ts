import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;
  const userId = decodedUser?.id;

  if (userRole !== "Student") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    // Fetch the results for the student
    const studentResults = await prisma.result.findMany({
      where: { studentId: userId },  // Query by studentId
      select: { resultFile: true, semester: true, uploadedAt: true, isRepeater: true },
    });

    if (!studentResults || studentResults.length === 0) {
      return NextResponse.json({ message: "Results not found!" }, { status: 404 });
    }

    // Returning the results as base64
    const results = studentResults.map((result) => ({
      semester: result.semester,
      uploadedAt: result.uploadedAt,
      isRepeater: result.isRepeater,
      resultFile: result.resultFile.toString("base64"),  // Sending as base64
    }));

    return NextResponse.json({
      message: "Results fetched successfully!",
      success: true,
      results,
    });
  } catch (error: any) {
    console.error("Error fetching results:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
