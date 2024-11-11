import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;

  if (userRole !== "Admin") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }
  try {
    const semester = await prisma.batch.findFirst({
      where: {
        isActive: true,
      },
      select: {
        currentSemester: true,
      },
    });

    if (!semester) {
      return NextResponse.json(
        { message: "No Batches found", success: false },
        { status: 400 }
      );
    }

    const session = semester.currentSemester % 2 === 0 ? "Even" : "Odd";
    return NextResponse.json({ session, success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error, success: false },
      { status: 500 }
    );
  }
}
