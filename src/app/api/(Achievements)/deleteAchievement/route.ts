import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const { userId, userRole, achievement } = await req.json();
    let user;
    let updatedUser;

    if (userRole === "Staff") {
      user = await prisma.staffDetails.findUnique({
        where: { id: userId },
      });
    } else if (userRole === "Student") {
      user = await prisma.studentDetails.findUnique({
        where: { id: userId },
      });
    } else {
      return NextResponse.json({ error: "Invalid user role" }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const achievements = user.achievements ? JSON.parse(user.achievements) : [];

    if (!Array.isArray(achievements)) {
      return NextResponse.json(
        { error: "Invalid achievements format" },
        { status: 400 }
      );
    }

    const updatedAchievements = achievements.filter(
      (a: any) =>
        a.title !== achievement.title ||
        a.description !== achievement.description ||
        a.date !== achievement.date ||
        a.category !== achievement.category
    );

    const updateData = {
      achievements: JSON.stringify(updatedAchievements),
    };

    if (userRole === "Staff") {
      updatedUser = await prisma.staffDetails.update({
        where: { id: userId },
        data: updateData,
      });
    } else {
      updatedUser = await prisma.studentDetails.update({
        where: { id: userId },
        data: updateData,
      });
    }

    return NextResponse.json({ updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error deleting achievement:", error);
    return NextResponse.json(
      { error: "Error deleting achievement" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
