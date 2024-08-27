import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  let userRole = null;

  if (token) {
    const decodedToken = verifyToken(token);
    if (decodedToken && typeof decodedToken === "object") {
      userRole = decodedToken.role;
    }
  }

  if (userRole !== "Admin") {
    return NextResponse.json({ message: "Access Denied" }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!users.length) {
      return NextResponse.json({ message: "No users found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
