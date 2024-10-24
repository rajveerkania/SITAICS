// pages/api/student/viewResults.ts
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
    const results = await prisma.result.findMany({
      where: { studentId: userId },
      select: {
        semester: true,
        resultFile: true,
        isRepeater: true,
      },
    });

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Error fetching results:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
