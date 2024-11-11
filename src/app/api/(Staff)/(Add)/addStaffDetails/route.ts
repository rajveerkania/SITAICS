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
      contactNo,
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
    const updateStaffData = {
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

    if (existingStaff) {
      staffDetails = await prisma.staffDetails.update({
        where: { id: userId },
        data: updateStaffData,
      });
    } else {
      staffDetails = await prisma.staffDetails.create({
        data: { id: userId, ...updateStaffData },
      });
    }

    if (isBatchCoordinator && batchId) {
      await prisma.batch.update({
        where: { batchId },
        data: { staffId: userId },
      });
    }

    if (selectedSubjectIds && selectedSubjectIds.length > 0) {
      const subjectDetails = await prisma.subject.findMany({
        where: { subjectId: { in: selectedSubjectIds } },
        select: { subjectId: true, semester: true, courseId: true },
      });
    
      for (const subject of subjectDetails) {
        const { courseId, subjectId, semester } = subject;
    
        // Fetch batches that are associated with the courseId and match the semester
        const relevantBatches = await prisma.batch.findMany({
          where: {
            courseId,
            currentSemester: semester, 
          },
          select: { batchId: true },
        });
    
        for (const batch of relevantBatches) {
          // Check if the batchSubject entry already exists
          const existingBatchSubject = await prisma.batchSubject.findUnique({
            where: {
              batchId_subjectId: {
                batchId: batch.batchId,
                subjectId,
              },
            },
          });
    
          if (!existingBatchSubject) {
            // If not, create a new entry in the batchSubject table
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
