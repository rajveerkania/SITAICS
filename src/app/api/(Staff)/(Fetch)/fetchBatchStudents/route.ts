//This API IS FETCHING BATCH COORDINATIOR'S BATCH STUDENTS LIST & DETAILS 
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma"; 
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth";

export async function POST(request: NextRequest) {
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

    if (!staffDetails || !staffDetails.batchId) {
      console.log("No primary batch ID found for staff member");
      return NextResponse.json({ message: "No batch assigned" }, { status: 404 });
    }

    const primaryBatchId = staffDetails.batchId;

    // Step 2: Fetch the batch name using the batchId
    const batchDetails = await prisma.batch.findUnique({
      where: { batchId: primaryBatchId },
      select: { batchName: true },
    });

    if (!batchDetails || !batchDetails.batchName) {
      console.log("Batch name not found for the provided batch ID");
      return NextResponse.json({ message: "Batch not found" }, { status: 404 });
    }

    const batchName = batchDetails.batchName;

    // Step 3: Fetch students associated with the batch name
    const students = await prisma.studentDetails.findMany({
      where: {
        batchName: batchName,  // Only fetch students in this batch
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
