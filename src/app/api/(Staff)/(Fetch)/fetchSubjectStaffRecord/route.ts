import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth";
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    console.log("Token:", token ? "Present" : "Not present");
    let id = null, role = null;
    if (token) {
      const decodedToken = verifyToken(); // Pass the token to verify it
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
     const associatedBatchSubjects = await prisma.batchSubject.findMany({
      where: { staffId: id },
      select: { subjectId: true },
    });
    if (associatedBatchSubjects.length === 0) {
      console.log("No subjects assigned to staff member");
      return NextResponse.json({ message: "No subjects assigned" }, { status: 404 });
    }
    // Step 2: Extract the subjectIds
    const subjectIds = associatedBatchSubjects.map((batchSubject) => batchSubject.subjectId);
    // Step 3: Fetch subject names from Subject table using the subjectIds
    const subjects = await prisma.subject.findMany({
      where: { subjectId: { in: subjectIds } },
      select: { subjectName: true },
    });
    if (subjects.length === 0) {
      console.log("No subjects found for the given subject IDs");
      return NextResponse.json({ message: "No subjects found" }, { status: 404 });
    }
    // Step 4: Return the subject names
    const subjectNames = subjects.map((subject) => subject.subjectName);
    return NextResponse.json({ subjects: subjectNames }, { status: 200 });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}