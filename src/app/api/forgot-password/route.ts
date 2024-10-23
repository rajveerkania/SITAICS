import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import sendPasswordResetEmail from "@/lib/sendemail";
import crypto from "crypto";

// Define a type for the request body
interface ForgotPasswordRequestBody {
  emailOrUsername: string;
}

// Helper function to generate the reset token
function generateResetToken() {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const tokenExpiry = new Date(Date.now() + 3600000); // Token valid for 1 hour
  return { resetToken, tokenExpiry };
}

// Named export for handling POST requests
export async function POST(req: NextRequest) {
  try {
    const body: ForgotPasswordRequestBody = await req.json();
    const { emailOrUsername } = body;

    // Validate input
    if (!emailOrUsername) {
      return NextResponse.json(
        { success: false, message: "Email or Username is required." },
        { status: 400 }
      );
    }

    // Find the user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });

    // If no user is found, return a 404 response
    if (!user) {
      return NextResponse.json(
        { success: false, message: "No account found with that information." },
        { status: 404 }
      );
    }

    // Generate a password reset token
    const { resetToken, tokenExpiry } = generateResetToken();

    // Update the user with the reset token and expiry
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordTokenExpiry: tokenExpiry,
      },
    });

    // Construct the password reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send the reset email
    await sendPasswordResetEmail(user.email, resetUrl);

    // Return success response
    return NextResponse.json(
      { success: true, message: "Password reset email sent successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forgot-password:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
