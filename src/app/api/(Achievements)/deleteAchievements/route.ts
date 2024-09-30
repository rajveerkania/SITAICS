import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

// Existing GET and POST methods...

export async function DELETE(request: NextRequest) {
    const decodedUser = verifyToken();
    const userId = decodedUser?.id;

    // Check if the user ID is available
    if (!userId) {
        return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
    }

    try {
        // Parse the request body to get the achievement ID
        const { achievementId } = await request.json();

        // Retrieve staff details to access achievements
        const staffDetails = await prisma.staffDetails.findUnique({
            where: { id: userId },
        });

        // Check if staff details were found
        if (!staffDetails) {
            return NextResponse.json({ error: "Staff details not found!" }, { status: 404 });
        }

        // Parse the existing achievements
        const currentAchievements = staffDetails.achievements ? JSON.parse(staffDetails.achievements) : [];

        // Filter out the achievement to delete
        const updatedAchievements = currentAchievements.filter((achievement: { id: number }) => achievement.id !== achievementId);

        // Update the achievements in the database
        await prisma.staffDetails.update({
            where: { id: userId },
            data: { achievements: JSON.stringify(updatedAchievements) },
        });

        return NextResponse.json({ message: "Achievement deleted!" });
    } catch (error) {
        console.error("Error deleting achievement:", error);
        return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
    }
}
