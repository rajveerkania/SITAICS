import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;

  if (userRole !== "Admin") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    const studentCount = await prisma.studentDetails.count({
      where: { isActive: true },
    });

    const staffCount = await prisma.staffDetails.count({
      where: { isActive: true },
    });

    const totalCoursesCount = await prisma.course.count({
      where: { isActive: true },
    });

    const studentData = await prisma.studentDetails.groupBy({
      by: ["courseName"],
      _count: { courseName: true },
      where: { isActive: true },
    });

    const formattedStudentData = studentData.map((item) => ({
      course: item.courseName,
      students: item._count.courseName,
    }));

    return NextResponse.json(
      {
        studentCount,
        staffCount,
        totalCoursesCount,
        formattedStudentData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
