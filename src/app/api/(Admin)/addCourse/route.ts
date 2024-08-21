import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth";

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  let userRole = null;

  if (token) {
    const decodedToken = verifyToken(token);
    if (decodedToken && typeof decodedToken === "object") {
      userRole = decodedToken.role;
    }
  }

  if (userRole !== "Admin") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    const reqBody = await request.json();
    const { courseName, courseDuration } = reqBody;
    console.log(reqBody);
    const course = await Course.findOne({ courseName });
    if (course) {
      return NextResponse.json(
        { error: "course already exists" },
        { status: 400 }
      );
    }
    const addCourse = new Course({
      courseName,
      courseDuration,
    });
    const savedCourse = await addCourse.save();
    console.log(savedCourse);

    return NextResponse.json({
      message: "Course added successfully",
      success: true,
      savedCourse,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
