import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  // Verify the user role
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;

  // if (!["Admin", "Staff"].includes(userRole!)) {
  //   return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  // }

  try {
    // Fetch all student details
    const students = await prisma.studentDetails.findMany({
      select: {
        username: true,
        name: true,
        fatherName: true,
        motherName: true,
        enrollmentNumber: true,
        dateOfBirth: true,
        gender: true,
        bloodGroup: true,
        contactNo: true,
      },
    });

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error("Error fetching student details:", error);
    return NextResponse.json(
      { error: "Failed to fetch student details" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
