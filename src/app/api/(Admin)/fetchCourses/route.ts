import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function GET() {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;

  // if (userRole !== "Admin") {
  //   return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  // }

  try {
    const courses = await prisma.course.findMany();
    return NextResponse.json(
      { message: "Courses fetched", courses },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
