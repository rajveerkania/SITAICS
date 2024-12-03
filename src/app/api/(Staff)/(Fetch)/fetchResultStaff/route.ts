import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;
  const userId = decodedUser?.id;

  if (userRole !== "Staff") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  const staffId = userId; // Use the userId extracted from the token

  try {
    // Step 1: Fetch Batch ID using Staff ID
    const staff = await prisma.staffDetails.findUnique({
      where: { id: staffId },
      select: { batchId: true },
    });

    if (!staff) {
      return NextResponse.json({ message: "Staff not found" }, { status: 404 });
    }

    // Step 2: Fetch Batch Name using Batch ID
    const batch = await prisma.batch.findUnique({
      where: { batchId: staff.batchId },
      select: { batchName: true },
    });

    if (!batch) {
      return NextResponse.json({ message: "Batch not found" }, { status: 404 });
    }

    // Step 3: Fetch all Student IDs using Batch Name
    const students = await prisma.studentDetails.findMany({
      where: { batchName: batch.batchName },
      select: { id: true },
    });

    const studentIds = students.map((student) => student.id);

    // Step 4: Fetch the Results using Student IDs, including URL and Student Name
    const results = await prisma.result.findMany({
      where: { studentId: { in: studentIds } },
      include: {
        student: { select: { name: true } }, // Include student name
      },
    });

    // Format results to include student name
    const formattedResults = results.map(result => ({
      id: result.id,
      studentName: result.student.name,
      semester: result.semester, // Ensure 'semester' is a field in your result table
      url: result.resultFile, // Include URL to view the result
    })); 

    return NextResponse.json(formattedResults, { status: 200 });
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
