//This API Is Used for fetching those batches whos BatchCoordintator is not assigned 
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;
 
  // Only allow staff members to access this endpoint
  if (userRole !== "Staff") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const batchId = searchParams.get("batchId");

  try {
    if (batchId) {
      const batch = await prisma.batch.findUnique({
        where: { batchId },
        include: {
          course: {
            select: { courseName: true },
          },
          students: true,
        },
      });

    // Return the unassigned batch names and IDs as  JSON
    return NextResponse.json(unassignedBatches, { status: 200 });
  } catch (error) {
    console.error("Error fetching unassigned batches:", error);
    return NextResponse.json(
      { error: "Failed to fetch unassigned batches" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
