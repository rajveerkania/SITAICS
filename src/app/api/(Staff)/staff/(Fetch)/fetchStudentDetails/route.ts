import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth";

export async function POST(request: NextRequest) {
  console.log("API route hit: /api/fetchStudentsByBatch");
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

    if (!id || !role || (role !== "Admin" && role !== "Staff")) {
      console.log("Unauthorized access attempt");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }   

    const body = await request.json();
    const batchName = body.batchName;
    console.log("Requested batch name:", batchName);

    if (!batchName) {
      console.log("Batch name not provided");
      return NextResponse.json({ message: "Batch name is required" }, { status: 400 });
    }

    console.log("Fetching students from database");
     const students = await prisma.studentDetails.findMany({
      where: {
        batchName: batchName,
        isActive: true,
      },
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
  } 
  catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}