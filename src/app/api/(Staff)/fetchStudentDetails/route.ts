// /pages/api/fetchStudentDetails.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // Verify the user token
    const decodedUser = verifyToken();
    console.log("Decoded User:", decodedUser); // Log decoded user for debugging

    if (!decodedUser || decodedUser.role !== "Staff") {
      return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
    }

    const staffId = decodedUser.id;
    console.log("Staff ID:", staffId); // Log staff ID for debugging

    // Retrieve the staff member's batchId
    const staff = await prisma.staffDetails.findUnique({
      select: { batchId: true },
      where: { id: staffId },
    });

    console.log("Staff Details:", staff); // Log staff details for debugging

    if (!staff || !staff.batchId) {
      return NextResponse.json(
        { message: "No batch assigned to this staff member." },
        { status: 400 }
      );
    }

    // Retrieve the batch name using the batchId
    const batch = await prisma.batch.findUnique({
      where: { batchId: staff.batchId },
      select: { batchName: true },
    });

    console.log("Batch Details:", batch); // Log batch details for debugging

    if (!batch || !batch.batchName) {
      return NextResponse.json(
        { message: "Batch not found." },
        { status: 400 }
      );
    }

    const batchName = batch.batchName;

    // Fetch students from the specified batch
    const students = await prisma.studentDetails.findMany({
      where: { batchName: batchName },
      select: {
        username: true,
        name: true,
        enrollmentNumber: true,
        email: true,
        batchName: true,
      },
    });

    return NextResponse.json({ students }, { status: 200 });
  } catch (error) {
    console.error("Error fetching student details:", error);
    return NextResponse.json(
      { error: "Failed to fetch student details." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
