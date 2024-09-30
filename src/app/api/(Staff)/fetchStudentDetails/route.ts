// /pages/api/fetchStudentDetails.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // Verify the user token
    const decodedUser = verifyToken();
    if (!decodedUser || decodedUser.role !== "Staff") {
      return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
    }

    const staffId = decodedUser.id;

    // Retrieve the batches coordinated by the staff member
    const staff = await prisma.staffDetails.findUnique({
      where: { id: staffId },
      select: {
        batches: {
          select: {
            name: true, // Assuming each batch has a 'name' field
          },
        },
      },
    });

    if (!staff || !staff.batches || staff.batches.length === 0) {
      return NextResponse.json(
        { message: "No batches assigned to this staff member." },
        { status: 400 }
      );
    }

    const batchNames = staff.batches.map((batch) => batch.name);

    // Fetch students from the coordinated batches
    const students = await prisma.studentDetails.findMany({
      where: { batch: { in: batchNames } },
      select: {
        username: true,
        name: true,
        enrollmentNumber: true,
        email: true,
        present: true, // Assuming 'present' field exists
        batch: true,
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
