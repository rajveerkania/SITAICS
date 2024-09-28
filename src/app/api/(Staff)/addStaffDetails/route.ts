import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {
      id,
      email,
      username,
      name,
      isBatchCoordinator,
      batchId,
      dateOfBirth,
      gender,
      subjects, // Assuming subjects will be an array of subject IDs
      contactNumber,
      achievements,
      address,
      city,
      state,
      pinCode,
    } = reqBody;

    const parsedDateOfBirth = dateOfBirth ? new Date(`${dateOfBirth}T00:00:00Z`) : null;

    const batchRecord = await prisma.batch.findUnique({
      where: { batchId: batchId },
      select: { batchId: true },
    });

    if (!batchRecord) {
      return NextResponse.json({ error: "Batch not found" }, { status: 400 });
    }

    const existingStaff = await prisma.staffDetails.findUnique({
      where: { id: id },
    });

    let staffDetails;

    if (existingStaff) {
      // Update existing staff
      staffDetails = await prisma.staffDetails.update({
        where: { id: id },
        data: {
          email,
          username,
          name,
         
          dateOfBirth: parsedDateOfBirth,
          gender,
          contactNumber,
          address,
          city,
          state,
          pinCode,
          isProfileCompleted: true,
          
        },
      });
    } else {
      // Create new staff
      staffDetails = await prisma.staffDetails.create({
        data: {
          id,
          email,
          username,
          name,
         
          
          dateOfBirth: parsedDateOfBirth,
          gender,
          contactNumber,
        
          address,
          city,
          state,
          pinCode,
          isProfileCompleted: true,
          
        },
      });
    }

    console.log(
      (existingStaff ? "Updated" : "Created") + " staff details:",
      staffDetails
    );

    return NextResponse.json({
      message: `Staff Details ${existingStaff ? "updated" : "created"} successfully`,
      success: true,
      staffDetails,
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
