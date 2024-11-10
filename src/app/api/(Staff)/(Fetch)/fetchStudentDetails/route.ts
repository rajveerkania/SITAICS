import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth";

export async function POST(request: NextRequest) {
  console.log("API route hit: /api/fetchStudentDetails"); 

  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    console.log("Token:", token ? "Present" : "Not present");

    let id = null, role = null;
    if (token) {
      const decodedToken = verifyToken();
      if (decodedToken && typeof decodedToken === "object") {
        id = decodedToken.id;
        role = decodedToken.role;
        console.log("Decoded token - ID:", id, "Role:", role);
      }
    }

    if (!id || role !== "Staff") {
      console.log("Unauthorized access attempt");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Step 1: Fetch the primary batch ID assigned to the staff
    const staffDetails = await prisma.staffDetails.findUnique({
      where: { id },
      select: { batchId: true },
    });

    // Step 2: Fetch additional batch IDs from the BatchSubject table if any
    const associatedBatchSubjects = await prisma.batchSubject.findMany({
      where: { staffId: id },
      select: { batchId: true },
    });
    const additionalBatchIds = associatedBatchSubjects.map((subject) => subject.batchId);

    // Combine primary batch and associated batches if primary batch exists
    let batchIds = staffDetails?.batchId
      ? Array.from(new Set([staffDetails.batchId, ...additionalBatchIds])) // Deduplicate batch IDs
      : additionalBatchIds;

    if (batchIds.length === 0) {
      console.log("No batches found for staff member");
      return NextResponse.json({ message: "No batches assigned" }, { status: 404 });
    }

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

    console.log("Number of students fetched:", students.length);
    return NextResponse.json({ students }, { status: 200 });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}
