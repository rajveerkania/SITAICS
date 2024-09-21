import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { title, description, date, file, userId, isStudent } = await req.json();

    // Validate input data
    if (!title || !description || !date || !userId) {
      return NextResponse.json({ success: false, message: "All fields are required." }, { status: 400 });
    }

    // Convert date to Date object
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ success: false, message: "Invalid date format." }, { status: 400 });
    }

    // Determine achievement data
    const achievementData: any = {
      title,
      description,
      date: parsedDate,
      file: file || null, // Default to null if file is not provided
    };

    if (isStudent) {
      achievementData.studentId = userId.toString(); // Ensure userId is a string if schema expects a string
    } else {
      achievementData.staffId = userId.toString(); // Ensure userId is a string if schema expects a string
    }

    // Insert into the database
    const newAchievement = await prisma.achievement.create({
      data: achievementData,
    });

    return NextResponse.json({ success: true, achievement: newAchievement }, { status: 200 });
  } catch (error) {
    console.error("Error adding achievement:", error);

    const errorMessage = error instanceof Error ? error.message : "Failed to add achievement";

    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
