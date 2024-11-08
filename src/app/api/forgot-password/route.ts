import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import sendPasswordResetEmail from "@/lib/sendemail";
import crypto from "crypto";

interface ForgotPasswordRequestBody {
  emailOrUsername: string;
}

function generateResetToken() {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const tokenExpiry = new Date(Date.now() + 3600000);
  return { resetToken, tokenExpiry };
}

export async function POST(req: NextRequest) {
  try {
    const body: ForgotPasswordRequestBody = await req.json();
    const { emailOrUsername } = body;

    if (!emailOrUsername) {
      return NextResponse.json(
        { success: false, message: "Email or Username is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });

    if (!user) {
       return NextResponse.json(
        { success: false, message: "No account found with that information." },
        { status: 404 }
      );
    }

    const { resetToken, tokenExpiry } = generateResetToken();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordTokenExpiry: tokenExpiry,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendPasswordResetEmail(user.email, resetUrl);

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
