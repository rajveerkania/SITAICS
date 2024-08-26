import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {
      studentId,
      enrollmentNumber,
      batch,
      address,
      city,
      state,
      gender,
      pinCode,
      bloodGroup,
      dateOfBirth,
      achievements,
      contactNo,
      results,
    } = reqBody;

    const parsedDateOfBirth = new Date(dateOfBirth);

    parsedDateOfBirth.setHours(0, 0, 0, 0);

    const batchRecord = await prisma.batch.findUnique({
      where: { batchName: batch },
      select: { batchId: true },
    });

    if (!batchRecord) {
      return NextResponse.json({ error: "Batch not found" }, { status: 400 });
    }

    const existingStudent = await prisma.studentDetails.findUnique({
      where: { id: studentId },
    });

    let studentDetails;
    let updatedBatch;

    if (existingStudent) {
      [studentDetails, updatedBatch] = await prisma.$transaction([
        prisma.studentDetails.update({
          where: { id: studentId },
          data: {
            enrollmentNumber,
            batchId: batchRecord.batchId,
            address,
            bloodGroup,
            // dob:parsedDateOfBirth,
            city,
            state,
            gender,
            pinCode,
            achievements,
            contactNo,
            results,
            isProfileCompleted: true,
          },
        }),
        prisma.batch.update({
          where: { batchId: batchRecord.batchId },
          data: {
            students: {
              connect: { id: studentId },
            },
          },
        }),
      ]);
    }

    console.log(
      (existingStudent ? "Updated" : "Created") + " student details:",
      studentDetails
    );
    console.log("Updated batch:", updatedBatch);

    return NextResponse.json({
      message: `Student Details ${
        existingStudent ? "updated" : "created"
      } successfully`,
      success: true,
      studentDetails,
      updatedBatch,
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
