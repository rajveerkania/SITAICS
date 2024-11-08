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
      subjectCount,
    } = reqBody;

    const parsedDateOfBirth = new Date(`${dateOfBirth}`);

    const existingStaff = await prisma.staffDetails.findUnique({
      where: { id: userId },
    });

    let staffDetails;

    if (existingStaff) {
      // Update the existing staff details
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
        // Update the Batch table to add the staffId
        prisma.batch.update({
          where: { batchId }, // Find the batch by its ID
          data: {
            staffId: isBatchCoordinator ? userId : null, // Update staffId if the user is a batch coordinator
          },
        }),
      ]);
    }

    // Handle the subject updates conditionally based on subjectCount
    const batchSubjectUpdates = selectedSubjectIds.length > 0
      ? selectedSubjectIds.map((subjectId: string) =>
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
            }
          })
        )
      : []; // If subjectCount is 0, no updates should be made

    // Execute the transaction if there are updates to process
    if (batchSubjectUpdates.length > 0) {
      await prisma.$transaction(batchSubjectUpdates);
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
