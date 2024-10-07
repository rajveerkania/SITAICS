// File: app/api/admin/updateUser/[userId]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const decodedUser = verifyToken();
    if (decodedUser?.role !== "Admin") {
      return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
    }

    const userId = params.userId;
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const data = await request.json();
    const { role, ...updateData } = data;

    if (!role) {
      return NextResponse.json(
        { message: "Role is required" },
        { status: 400 }
      );
    }

    let updatedUser;
    switch (role) {
      case "Student":
        updatedUser = await prisma.studentDetails.update({
          where: { id: userId },
          data: updateData,
        });
        break;
      case "Staff":
        updatedUser = await prisma.staffDetails.update({
          where: { id: userId },
          data: updateData,
        });
        break;
      case "Admin":
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: updateData,
        });
        break;
      default:
        return NextResponse.json(
          { message: "Invalid role specified" },
          { status: 400 }
        );
    }

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Error updating user" },
      { status: 500 }
    );
  }
}