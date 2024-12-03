import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;

  if (userRole !== "Student") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { error: "studentId is required" },
        { status: 400 }
      );
    }

    // Step 1: Fetch the batch name using studentId
    const student = await prisma.studentDetails.findUnique({
      where: { id: studentId },
      select: { batchName: true },
    });

    if (!student || !student.batchName) {
      return NextResponse.json(
        { error: "Student or batch information not found" },
        { status: 404 }
      );
    }

    // Step 2: Fetch batchId and currentSemester using batchName
    const batch = await prisma.batch.findUnique({
      where: { batchName: student.batchName },
      select: { batchId: true, currentSemester: true },
    });

    if (!batch) {
      return NextResponse.json(
        { error: "Batch information not found" },
        { status: 404 }
      );
    }

    // Step 3: Fetch all subjectId and staffId using batchId and currentSemester
    const batchSubjects = await prisma.batchSubject.findMany({
      where: { batchId: batch.batchId, semester: batch.currentSemester },
      select: { subjectId: true, staffId: true },
    });

    if (batchSubjects.length === 0) {
      return NextResponse.json(
        { error: "No subjects found for the current semester" },
        { status: 404 }
      );
    }

    // Step 4: Fetch subject details and staff details
    const subjectIds = batchSubjects.map((bs) => bs.subjectId);
    const staffIds = batchSubjects.map((bs) => bs.staffId).filter(Boolean);

    const subjects = await prisma.subject.findMany({
      where: { subjectId: { in: subjectIds } },
      select: {
        subjectId: true,
        subjectName: true,
        subjectCode: true,
        semester: true,
      },
    });

    const staff = await prisma.staffDetails.findMany({
      where: { id: { in: staffIds as string[] } },
      select: { id: true, name: true },
    });

    // Map staff to subjects
    const staffMap = new Map();
    staff.forEach((s) => staffMap.set(s.id, s.name));

    const responseSubjects = subjects.map((subject) => {
      const assignedStaff = batchSubjects
        .filter((bs) => bs.subjectId === subject.subjectId)
        .map((bs) => staffMap.get(bs.staffId) || "Not Assigned");

      return {
        subjectId: subject.subjectId,
        subjectName: subject.subjectName,
        subjectCode: subject.subjectCode,
        semester: subject.semester,
        staff: assignedStaff.length > 0 ? assignedStaff : ["Not Assigned"],
      };
    });

    // Step 5: Send the result
    return NextResponse.json({
      studentId,
      batchName: student.batchName,
      currentSemester: batch.currentSemester,
      subjects: responseSubjects,
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching subjects" },
      { status: 500 }
    );
  }
}
