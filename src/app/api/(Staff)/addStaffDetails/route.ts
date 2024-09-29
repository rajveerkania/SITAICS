import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const reqBody = await request.json();
    const {
      email,
      username,
      name,
      isBatchCoordinator,
      batchId,
      contactNumber,
      isProfileCompleted,
    } = reqBody;

    const decodedUser = verifyToken(); // Assuming verifyToken reads the token and returns decoded user details
    const staffId = decodedUser?.id;
    console.log(staffId)
    // Check if required fields are present
    if (!staffId) {
      return NextResponse.json(
        { error: "Staff ID is required" },
        { status: 400 }
      );
    }

    // Check if the batchId exists in the database
    let batchRecord = null;
    if (batchId) {
      batchRecord = await prisma.batch.findUnique({
        where: { batchId },
        select: { batchId: true },
      });

      if (!batchRecord) {
        return NextResponse.json(
          { error: `Batch with ID '${batchId}' does not exist` },
          { status: 400 }
        );
      }
    }

    // Check if the staff member already exists
    const existingStaff = await prisma.staffDetails.findUnique({
      where: { id: staffId },
    });

    let staffDetails;
    // Update or create staff details based on the existence check
    if (existingStaff) {
      staffDetails = await prisma.staffDetails.update({
        where: { id: staffId },
        data: {
          email,
          username,
          name,
          isBatchCoordinator,
          batchId: batchRecord?.batchId || null,
          contactNumber: contactNumber || null,
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
          batchId: batchRecord?.batchId || null,
          contactNumber: contactNumber || null,
          isProfileCompleted : true,
        },
      });
    }

    // Update the batch if batchRecord exists
    let updatedBatch = null;
    if (batchRecord) {
      updatedBatch = await prisma.batch.update({
        where: { batchId: batchRecord.batchId },
        data: {
          staffMembers: {
            connect: { id: staffId },
          },
        },
      });
    }

    // Log the result in the server console
    console.log(
      (existingStaff ? "Updated" : "Created") + " staff details:",
      staffDetails
    );
    if (updatedBatch) {
      console.log("Updated batch:", updatedBatch);
    }

    // Return a success response
    return NextResponse.json({
      message: `Staff Details ${existingStaff ? "updated" : "created"} successfully`,
      success: true,
      staffDetails,
      updatedBatch,
    });
  } catch (error: any) {
    // Handle and log errors
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
