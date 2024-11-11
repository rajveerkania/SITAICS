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
      batchId, // this is the batchId for the batch coordinator
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
            isSemesterUpdated: true,
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
    const updateStaffData = {
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
      batchId: isBatchCoordinator ? batchId : null, // Only update batchId if the user is a batch coordinator
      isProfileCompleted: true,
    };

    if (existingStaff) {
      // Update existing staff details
      staffDetails = await prisma.staffDetails.update({
        where: { id: userId },
        data: updateStaffData,
      });
    } else {
      // Create new staff details
      staffDetails = await prisma.staffDetails.create({
        data: { id: userId, ...updateStaffData },
      });
    }

    if (isBatchCoordinator && batchId) {
      // If the user is a batch coordinator, update the batch table with their staffId
      await prisma.batch.update({
        where: { batchId },
        data: {
          staffId: userId,
        },
      });
    }

    if (selectedSubjectIds && selectedSubjectIds.length > 0) {
      // Retrieve the courseId and semester for each subject ID from the Subject table
      const subjectDetails = await prisma.subject.findMany({
        where: { subjectId: { in: selectedSubjectIds } },
        select: { subjectId: true, semester: true, courseId: true },
      });

      // Loop through each subject to find the associated batch IDs for each course
      for (const subject of subjectDetails) {
        const { courseId, subjectId, semester } = subject;

        // Get all batchIds associated with this courseId
        const batches = await prisma.batch.findMany({
          where: { courseId },
          select: { batchId: true },
        });

        const batchSubjectUpdates = batches.map((batch) =>
          prisma.batchSubject.upsert({
            where: {
              batchId_subjectId: { batchId: batch.batchId, subjectId },
            },
            update: {
              staffId: userId,
              semester, // Assign the semester fetched from the subject table
            },
            create: {
              batchId: batch.batchId,
              subjectId,
              semester, // Assign the semester fetched from the subject table
              staffId: userId,
            },
          })
        );

        // Execute all batchSubject updates within a transaction
        await prisma.$transaction(batchSubjectUpdates);
      }
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
