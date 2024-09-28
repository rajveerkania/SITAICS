import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const courseName = url.searchParams.get("courseName");

    const batches = await prisma.batch.findMany({
      where: {
        course: {
          courseName: courseName || undefined,
          isActive: true,
        },
      },
      select: {
        batchName: true,
      },
    });

    return NextResponse.json({ success: true, batches }, { status: 200 });
  } catch (error) {
    console.error("Error fetching batches:", error);
    return NextResponse.json(
      { error: "Failed to fetch batches" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
