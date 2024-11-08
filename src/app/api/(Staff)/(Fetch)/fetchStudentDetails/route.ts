import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    let id = null,
      role = null;

    if (token) {
      const decodedToken = verifyToken();
      if (decodedToken && typeof decodedToken === "object") {
        id = decodedToken.id;
        role = decodedToken.role;
      }
    }

    if (!id || role !== "Staff") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Step 1: Fetch the primary batch ID assigned to the staff
    const staffDetails = await prisma.staffDetails.findUnique({
      where: { id },
      select: { batchId: true },
    });

    if (!staffDetails || !staffDetails.batchId) {
      return NextResponse.json(
        { message: "No batch assigned" },
        { status: 404 }
      );
    }

    const primaryBatchId = staffDetails.batchId;

    // Step 2: Fetch additional batch IDs where the staff is associated in BatchSubject table
    const associatedBatchSubjects = await prisma.batchSubject.findMany({
      where: { staffId: id },
      select: { batchId: true },
    });

    const additionalBatchIds = associatedBatchSubjects.map(
      (subject) => subject.batchId
    );
    const batchIds = Array.from(
      new Set([primaryBatchId, ...additionalBatchIds])
    ); // Deduplicate batch IDs

    // Step 3: Fetch batch names for all gathered batch IDs
    const batchDetails = await prisma.batch.findMany({
      where: { batchId: { in: batchIds } },
      select: { batchId: true, batchName: true },
    });

    const batchNames = batchDetails.map((batch) => batch.batchName);

    // Step 4: Fetch students associated with the batch names
    const students = await prisma.studentDetails.findMany({
      where: {
        batchName: { in: batchNames },
        isActive: true,
      },
      distinct: ["id"], // Ensure each student is listed only once
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        enrollmentNumber: true,
        courseName: true,
        batchName: true,
        isProfileCompleted: true,
      },
    });

    return NextResponse.json({ students }, { status: 200 });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
