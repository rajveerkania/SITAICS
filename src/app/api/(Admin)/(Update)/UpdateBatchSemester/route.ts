import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: { params: { batchId: string } }) {
  const decodedUser = verifyToken(); // No arguments needed
  const userRole = decodedUser?.role;

  if (userRole !== "Admin") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    const { batchId } = params;
    const { currentSemester } = await req.json();

    const updatedBatch = await prisma.batch.update({
      where: { batchId },
      data: { currentSemester: parseInt(currentSemester) },
    });

    return NextResponse.json(updatedBatch);
  } catch (error) {
    console.error("Error updating batch semester:", error);
    return NextResponse.json({ error: "Failed to update batch semester" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
