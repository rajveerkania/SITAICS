import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;
  const userId = decodedUser?.id;

  if (userRole !== "Staff") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    const reqBody = await request.json();
    const {
      email,
      name,
      gender,
      address,
      city,
      state,
      pinCode,
      contactNo,
      dateOfBirth,
      isBatchCoordinator,
      batchId,
      selectedSubjectIds,
      username,
    } = reqBody;

    const parsedDateOfBirth = new Date(dateOfBirth);
    if (isNaN(parsedDateOfBirth.getTime())) {
      return NextResponse.json({ message: "Invalid Date of Birth" }, { status: 400 });
    }

    const existingStaff = await prisma.staffDetails.findUnique({
      where: { id: userId },
    });

    const updateStaffData = {
      name,
      username,
      email,
      gender,
      address,
      city,
      state,
      pinCode,
      contactNo,
      dateOfBirth: parsedDateOfBirth,
      isBatchCoordinator,
      selectedSubjectIds,
      batchId: isBatchCoordinator ? batchId : null, 
      isProfileCompleted: true,
    };

    let staffDetails;
    if (existingStaff) {
      // Update existing staff details
      staffDetails = await prisma.staffDetails.update({
        where: { id: userId },
        data: updateStaffData,
      });
    } else {
      // If there's no existing staff, we need to handle 'id' properly.
      // If userId is available, use it. If not, generate a new UUID for the staff.
      const staffId = userId || randomUUID(); // Generate UUID if userId is not available
      staffDetails = await prisma.staffDetails.create({
        data: { id: staffId, ...updateStaffData },
      });
    }

    if (isBatchCoordinator && batchId) {
      await prisma.batch.update({
        where: { batchId },
        data: { staffId: userId },
      });
    }

    if (selectedSubjectIds?.length > 0) {
      const subjectDetails = await prisma.subject.findMany({
        where: { subjectId: { in: selectedSubjectIds } },
        select: { subjectId: true, semester: true, courseId: true },
      });

      const batchSubjectUpdates = subjectDetails.map((subject) =>
        prisma.batch.findMany({
          where: { courseId: subject.courseId },
          select: { batchId: true },
        })
      );

      await prisma.$transaction(batchSubjectUpdates.flat());
    }

    console.log(
      (existingStaff ? "Updated" : "Created") + " staff details:",
      staffDetails
    );

    return NextResponse.json({
      message: `Staff Details ${existingStaff ? "updated" : "created"} successfully, and subjects assigned.`,
      success: true,
      staffDetails,
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
