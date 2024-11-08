import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { id, password } = reqBody;

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 404 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Account is inactive. Please contact Admin." },
        { status: 403 }
      );
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      message: "Session updated successfully",
      
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}
