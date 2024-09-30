import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  try {
    const { batchId } = await request.json();

    if (!batchId || typeof batchId !== "string") {
      return NextResponse.json({ error: "Invalid batchId" }, { status: 400 });
    }

    const updatedBatch = await prisma.batch.update({
      where: { batchId },
      data: { isActive: false }, // Mark batch as inactive instead of deleting
    });

    return NextResponse.json(updatedBatch, { status: 200 });
  } catch (error) {
    console.error("Error deactivating batch:", error);
    return NextResponse.json(
      { error: "Failed to deactivate batch" },
      { status: 500 }
    );
  }
}
