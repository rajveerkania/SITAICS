import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { subjectId: string } }
) {
  try {
    const decodedUser = verifyToken();
    const userRole = decodedUser?.role;

    if (userRole !== "Admin") {
      return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
    }

    const { subjectId } = params;

    const updatedSubject = await prisma.subject.update({
      where: { subjectId },
      data: { isActive: false },
    });

    if (!updatedSubject) {
      return NextResponse.json(
        { message: "Subject not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Subject deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting subject:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the subject" },
      { status: 500 }
    );
  }
}