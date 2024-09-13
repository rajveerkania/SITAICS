import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function PUT(request: NextRequest) {
  try {
    const decodedUser = verifyToken();
    const userRole = decodedUser?.role;

    if (userRole !== "Admin") {
      return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
    }

    const { batchId } = await request.json();

    const validBatch = await prisma.batch.update({
      where: { batchId },
      data: { isActive: false },
    });

    if (!validBatch) {
      return NextResponse.json(
        { message: "Subject not found" },
        { status: 404 }
      );
    }

    if (validBatch)
      return NextResponse.json(
        { message: "Batch deleted successfully" },
        { status: 200 }
      );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete batch" },
      { status: 500 }
    );
  }
}
