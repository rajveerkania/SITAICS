import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth"; // Ensure this function returns decoded user data
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    // Verify the token and get the user ID
    const decodedUser = verifyToken(); // Assuming verifyToken reads the token and returns decoded user details
    const personID = decodedUser?.id;

    // Check if personID is defined
    if (!personID) {
      return NextResponse.json({ success: false, message: "User ID not found." }, { status: 401 });
    }

    // Parse the request body
    const { title, description, date, file } = await req.json();

    // Validate input data
    if (!title || !description || !date) { // File is optional, so no need to include it here
      return NextResponse.json({ success: false, message: "All fields except file are required." }, { status: 400 });
    }

    // Convert date to Date object
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ success: false, message: "Invalid date format." }, { status: 400 });
    }

    // Check if personID exists in either StudentDetails or StaffDetails
    const student = await prisma.studentDetails.findUnique({
      where: { id: personID },
    });

    const staff = await prisma.staffDetails.findUnique({
      where: { id: personID },
    });

    // Ensure we found at least one user (either student or staff)
    if (!student && !staff) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    }

    // Determine the name and user type
    const name = student?.name || staff?.name;
    const userType = student ? "student" : "staff";

    // Prepare achievement data
    const achievementData = {
      title,
      description,
      date: parsedDate,
      file: file || null, // File is optional, hence null by default
      personID, // personID is guaranteed to be a string
      name: name!, // Use non-null assertion if you're certain name will not be undefined
      personType: student ? "Student" : "Staff", // Determine type based on presence in respective table
    };

    // Insert into the database
    const newAchievement = await prisma.achievement.create({
      data: achievementData,
    });

    return NextResponse.json({ success: true, achievement: newAchievement }, { status: 200 });
  } catch (error: any) {
    console.error("Error adding achievement:", error);

    // Check for foreign key constraint failure
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      return NextResponse.json({ success: false, message: "Foreign key constraint failed. Ensure personID is valid." }, { status: 400 });
    }

    return NextResponse.json({ success: false, message: error.message || "An unexpected error occurred." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
