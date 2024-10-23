import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

interface ResetPasswordRequestBody {
  token: string;
  newPassword: string;
}

export async function POST(req: NextRequest) {

  const { token, newPassword }: ResetPasswordRequestBody = await req.json();

  if (!token || !newPassword) {
    return NextResponse.json(
      { success: false, message: "Token and new password are required." },
      { status: 400 }
    );
  }

  if (newPassword.length < 8) {
    return NextResponse.json(
      { success: false, message: "New password must be at least 8 characters long." },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordTokenExpiry: { gte: new Date() }, 
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
