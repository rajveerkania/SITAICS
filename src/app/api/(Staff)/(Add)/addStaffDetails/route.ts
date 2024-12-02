import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function POST(request: NextRequest) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;
  const userId = decodedUser?.id;

  // Check if the user role is 'Staff'
  if (userRole !== "Staff") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    // Parse request body
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
    } = reqBody;

    const parsedDateOfBirth = new Date(`${dateOfBirth}`);

    // Check if staff exists
    const existingStaff = await prisma.staffDetails.findUnique({
      where: { id: userId! },
    });

    // Create the staff data to be updated or created
    const updateStaffData: any = {
      name,
      email,
      gender,
      address,
      city,
      state,
      pinCode,
      contactNo,
      dateOfBirth: parsedDateOfBirth,
      isBatchCoordinator,
      batchId: isBatchCoordinator ? batchId : null,
      isProfileCompleted: true,
    };

    // If the staff exists, include the 'id' in the data for the update
    if (existingStaff) {
      updateStaffData.id = userId;
    }

    let staffDetails;
    if (existingStaff) {
      // Update existing staff details
      staffDetails = await prisma.staffDetails.update({
        where: { id: userId },
        data: updateStaffData,
      });
    } else {
      // Create a new staff record
      staffDetails = await prisma.staffDetails.create({
        data: updateStaffData, // No need to include 'id' here, Prisma will auto-generate it
      });
    }

    // If the user is a batch coordinator and has a batchId, update the batch
    if (isBatchCoordinator && batchId) {
      await prisma.batch.update({
        where: { batchId },
        data: { staffId: userId },
      });
    }

    // If selected subjects are provided, assign them
    if (selectedSubjectIds && selectedSubjectIds.length > 0) {
      const subjectDetails = await prisma.subject.findMany({
        where: { subjectId: { in: selectedSubjectIds } },
        select: { subjectId: true, semester: true, courseId: true },
      });

      // Loop through the subjects and assign them to relevant batches
      for (const subject of subjectDetails) {
        const { courseId, subjectId, semester } = subject;

        // Fetch batches that match the courseId and semester
        const relevantBatches = await prisma.batch.findMany({
          where: {
            courseId,
            currentSemester: semester,
          },
          select: { batchId: true },
        });

        for (const batch of relevantBatches) {
          // Check if the batch-subject relationship already exists
             {
            // If not, create the relationship
            await prisma.batchSubject.create({
              data: {
                batchId: batch.batchId,
                subjectId,
                semester,
                staffId: userId, // Assign the staff member
              },
            });
          }
        }
      }
    }

    // Return a success message with the updated or created staff details
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
