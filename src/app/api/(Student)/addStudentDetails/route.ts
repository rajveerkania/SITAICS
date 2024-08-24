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
      bloodGroup,
      dateOfBirth,
      achievements,
      contactNumber,
      results,
    } = reqBody;

    const dateOfBirthDate = dateOfBirth ? new Date(dateOfBirth) : undefined;

    const updatedStudentDetails = await prisma.studentDetails.update({
      where: { id: studentId },
      data: {
        enrollmentNumber,
        batch,
        address,
        bloodGroup,
        dateOfBirth: dateOfBirthDate,
        achievements,
        contactNumber,
        results,
        isProfileCompleted: true,
      },
    });

    console.log(
      "Updated " + studentId + " student's details:",
      updatedStudentDetails
    );

    return NextResponse.json({
      message: "Student Details updated successfully",
      success: true,
      updatedStudentDetails,
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
