import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {
      staffId,
      email,
      username,
      name,
      isBatchCoordinator,
      batchId, // batchId can be null
      contactNumber, // contactNumber can be null
      achievements, // achievements can be null
      isProfileCompleted,
    } = reqBody;

    if (!staffId) {
      return NextResponse.json(
        { error: "Staff ID is required" },
        { status: 400 }
      );
    }

    const existingStaff = await prisma.staffDetails.findUnique({
      where: { id: staffId },
    });

    let staffDetails;

    if (existingStaff) {
      staffDetails = await prisma.staffDetails.update({
        where: { id: staffId },
        data: {
          email,
          username,
          name,
          isBatchCoordinator,
          batchId: batchId || null,
          contactNumber: contactNumber || null,
          achievements: achievements || null,
          isProfileCompleted,
        },
      });
    } else {
      staffDetails = await prisma.staffDetails.create({
        data: {
          id: staffId,
          email,
          username,
          name,
          isBatchCoordinator,
          batchId: batchId || null,
          contactNumber: contactNumber || null,
          achievements: achievements || null,
          isProfileCompleted,
        },
      });
    }

    return NextResponse.json({
      message: `Staff Details ${existingStaff ? "updated" : "created"} successfully`,
      success: true,
      staffDetails,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
