import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

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
      contactNumber,
      dateOfBirth,
      isBatchCoordinator, 
      batchId,
      selectedSubjectIds,
    } = reqBody;

    const parsedDateOfBirth = new Date(`${dateOfBirth}`);

    const existingStaff = await prisma.staffDetails.findUnique({
      where: { id: userId },
    });

    let staffDetails;

    if (existingStaff) {
      staffDetails = await prisma.$transaction([
        prisma.staffDetails.update({
          where: { id: userId },
          data: {
            name,
            email,
            gender,
            address,
            city,
            state,
            pinCode,
            contactNumber,
            dateOfBirth: parsedDateOfBirth,
            isBatchCoordinator, 
            batchId: isBatchCoordinator ? batchId : null, 
            isProfileCompleted: true,
          },
        }),
      ]);
    }

    // Update BatchSubject table with the selected subjects and staff ID
    const batchSubjectUpdates = selectedSubjectIds.map((subjectId: string) =>
      prisma.batchSubject.upsert({
        where: {
          batchId_subjectId: { batchId, subjectId },
        },
        update: {
          staffId: userId,
        },
        create: {
          batchId,
          subjectId,
          semester: 1, // Adjust semester value as needed
          staffId: userId,
        },
      })
    );

    await prisma.$transaction(batchSubjectUpdates);

    console.log(
      (existingStaff ? "Updated" : "Created") + " staff details:",
      staffDetails
    );

    return NextResponse.json({
      message: `Staff Details ${
        existingStaff ? "updated" : "created"
      } successfully, and subjects assigned.`,
      success: true,
      staffDetails,
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
