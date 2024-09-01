import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function GET(req: Request) {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        batches: true,
        staff: true,
      },
    });
    return NextResponse.json(subjects, { status: 200 });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 });
  }
}
