import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Define a type for the request body
interface ResetPasswordRequestBody {
  token: string;
  newPassword: string;
}

// Export a named function for handling POST requests
export async function POST(req: NextRequest) {
  // Extract token and newPassword from the request body
  const { token, newPassword }: ResetPasswordRequestBody = await req.json();

  // Validate the input
  if (!token || !newPassword) {
    return NextResponse.json(
      { success: false, message: "Token and new password are required." },
      { status: 400 }
    );
  }

  // Password validation (for example, minimum length)
  if (newPassword.length < 8) {
    return NextResponse.json(
      { success: false, message: "New password must be at least 8 characters long." },
      { status: 400 }
    );
  }

  try {
    // Find the user with the valid reset token and non-expired token
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordTokenExpiry: { gte: new Date() }, // Check if token is not expired
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12); 

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      },
    });

    // Return a success response
    return NextResponse.json(
      { success: true, message: "Password reset successful." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in reset-password:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
