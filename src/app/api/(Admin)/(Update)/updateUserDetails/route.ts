import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth";

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    let adminId = null,
      adminRole = null;

    if (token) {
      const decodedToken = verifyToken();
      if (decodedToken && typeof decodedToken === "object") {
        adminId = decodedToken.id;
        adminRole = decodedToken.role;
      }
    }

    if (!adminId || adminRole !== "Admin") {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 403 }
      );
    }

    const data = await request.json();
    const { id, role, ...updateData } = data;

    if (!id || !role) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    let updatedUser;
    switch (role) {
      case "Student":
        updatedUser = await prisma.studentDetails.update({
          where: { id },
          data: updateData,
        });
        break;
      case "Staff":
        updatedUser = await prisma.staffDetails.update({
          where: { id },
          data: updateData,
        });
        break;
      case "Admin":
        updatedUser = await prisma.user.update({
          where: { id },
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