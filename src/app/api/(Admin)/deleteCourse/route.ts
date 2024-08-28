import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request) {
  try {
    const { courseId } = await req.json();

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const deletedCourse = await prisma.course.delete({
      where: { courseId },
    });

    if (deletedCourse) {
      return NextResponse.json({ success: true, message: "Course deleted successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}