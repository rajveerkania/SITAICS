import { NextResponse } from "next/server";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

// Fetch User Details by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        studentDetails: true, // Include student details if the user is a student
        staffDetails: true,   // Include staff details if the user is staff
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Include the correct details based on the user's role
    let roleDetails = {};

    if (user.role === Role.Student && user.studentDetails) {
      roleDetails = {
        ...user.studentDetails,
      };
    } else if (user.role === Role.Staff && user.staffDetails) {
      roleDetails = {
        ...user.staffDetails,
      };
    } else if (user.role === Role.Admin || user.role === Role.PO) {
      roleDetails = {
        // Admin and Placement Officer details (if any)
      };
    }

    const detailedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roleDetails, // Additional details based on role
    };

    return NextResponse.json(detailedUser);
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
