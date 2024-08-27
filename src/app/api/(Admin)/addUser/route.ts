import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth";
import { GetServerSideProps } from "next";

export async function POST(request: NextRequest) {
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
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    const reqBody = await request.json();
    const { username, name, email, password, role } = reqBody;
    const validRoles = ["Admin", "Staff", "PO", "Student"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        {
          error:
            "Invalid Role! Please choose from the following: Admin, Staff, PO, Student",
        },
        { status: 400 }
      );
    }

    const inactiveUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email, isActive: false },
          { username: username, isActive: false },
        ],
      },
    });

    if (inactiveUser) {
      return NextResponse.json(
        { error: "An inactive user with the same email or username exists!" },
        { status: 403 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email, isActive: true },
          { username: username, isActive: true },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists!" },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        username,
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    if (role === "Student") {
      await prisma.studentDetails.create({
        data: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          name: newUser.name,
        },
      });
    }

    if (role === "Staff") {
      await prisma.staffDetails.create({
        data: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          name: newUser.name,
        },
      });
    }

    return NextResponse.json({
      message: "User registered successfully",
      success: true,
      user: newUser,
    });
  } catch (error: any) {
    console.error("Error registering user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
