import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function POST(request: NextRequest) {
  const decodedUser = verifyToken();
  const userId = decodedUser?.id;

  if (!userId) {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    const reqBody = await request.json();
    const { title, description, date, category } = reqBody;

    const staffDetails = await prisma.staffDetails.findUnique({
      where: { id: userId },
    });
    if (!staffDetails) {
      return NextResponse.json(
        { error: "Staff details not found!" },
        { status: 404 }
      );
    }

    // Parse the existing achievements (if it's stored as a JSON string)
    const currentAchievements = staffDetails.achievements
      ? JSON.parse(staffDetails.achievements)
      : [];

    const newAchievement = {
      title,
      description,
      date,
      category,
    };

    const updatedAchievements = [...currentAchievements, newAchievement];

    // Convert the achievements array to a JSON string before saving
    const updatedStaff = await prisma.staffDetails.update({
      where: { id: userId },
      data: { achievements: JSON.stringify(updatedAchievements) },
    });

    return NextResponse.json({
      message: "Achievement added!",
      achievements: updatedStaff.achievements,
    });
  } catch (error) {
    console.error("Error adding achievement:", error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
