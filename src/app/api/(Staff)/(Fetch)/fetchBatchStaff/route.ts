import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;

  if (userRole !== "Staff") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    // Fetch all batches where no specific staff member is assigned (staffId is null)
    const unassignedBatches = await prisma.batch.findMany({
      where: {
        staffId: null, // Filter batches with no assigned staff
        isActive: true, // Optional: Only fetch active batches
      },
      select: {
        batchId: true,
        batchName: true,
      },
    });

    // Return the unassigned batch names and IDs as JSON
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