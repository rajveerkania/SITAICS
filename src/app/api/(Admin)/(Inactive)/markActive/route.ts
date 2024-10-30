import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function POST(request: NextRequest) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;

  if (userRole !== "Admin") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    const reqBody = await request.json();
    const { id, category } = reqBody;

    let result;

    switch (category) {
      case "admin":
        result = await prisma.user.update({
          where: { id },
          data: { isActive: true },
        });
        break;
      case "student":
        result = await prisma.$transaction([
          prisma.user.update({
            where: { id },
            data: { isActive: true },
          }),
          prisma.studentDetails.update({
            where: { id },
            data: { isActive: true },
          }),
        ]);
        break;
      case "staff":
        result = await prisma.$transaction([
          prisma.user.update({
            where: { id },
            data: { isActive: true },
          }),
          prisma.staffDetails.update({
            where: { id },
            data: { isActive: true },
          }),
        ]);
        break;
      case "po":
        result = await prisma.$transaction([
          prisma.user.update({
            where: { id },
            data: { isActive: true },
          }),
          prisma.staffDetails.update({
            where: { id },
            data: { isActive: true },
          }),
        ]);
        break;
      case "course":
        result = await prisma.course.update({
          where: { courseId: id },
          data: { isActive: true },
        });
        break;
      case "batch":
        result = await prisma.batch.update({
          where: { batchId: id },
          data: { isActive: true },
        });
        break;
      case "subject":
        result = await prisma.subject.update({
          where: { subjectId: id },
          data: { isActive: true },
        });
        break;
      default:
        return NextResponse.json(
          { message: "Invalid category" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      message: `${category} activated successfully`,
      success: true,
      result,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
