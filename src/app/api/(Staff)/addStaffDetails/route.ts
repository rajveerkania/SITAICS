import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function POST(request: NextRequest) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;
  const userId = decodedUser?.id

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
    } = reqBody;

    const parsedDateOfBirth = new Date(`${dateOfBirth}T00:00:00Z`);

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
            dateOfBirth : parsedDateOfBirth,
            isProfileCompleted: true,
          },
        })
      ]);
    }

    console.log(
      (existingStaff ? "Updated" : "Created") + " student details:",
      staffDetails
    );

    return NextResponse.json({
      message: `Student Details ${
        existingStaff ? "updated" : "created"
      } successfully`,
      success: true,
      staffDetails
    });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
