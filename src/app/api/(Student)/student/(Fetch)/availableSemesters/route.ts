import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
  const decodedUser = verifyToken(); // Verify the token to get user details
  const userRole = decodedUser?.role;
  const userId = decodedUser?.id;

  if (userRole !== "Student") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    // Fetch existing results for the student
    const existingResults = await prisma.result.findMany({
      where: {
        studentId: userId,
        isRepeater: false, // Only consider results where isRepeater is false
      },
      select: {
        semester: true,
      },
    });

    // Get an array of existing semesters
    const existingSemesters = existingResults.map(result => result.semester);

    // Define all semesters
    const allSemesters = [1, 2, 3, 4, 5, 6, 7, 8];

    // Filter semesters to find those not present in the database
    const availableSemesters = allSemesters.filter(semester => !existingSemesters.includes(semester));

    return NextResponse.json(availableSemesters);
  } catch (error: any) {
    console.error("Error fetching semesters:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
