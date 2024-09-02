import { NextRequest, NextResponse } from "next/server";
import csv from "csv-parser";
import { Readable } from "stream";
import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import { verifyToken } from "@/utils/auth";

export async function POST(request: NextRequest) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;

  if (userRole !== "Admin") {
    return NextResponse.json(
      { message: "Access Denied!", success: false },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    console.log(
      "File received:",
      file.name,
      "Size:",
      file.size,
      "Type:",
      file.type
    );

    const buffer = await file.arrayBuffer();
    const results: any[] = [];

    await new Promise<void>((resolve, reject) => {
      Readable.from(Buffer.from(buffer))
        .pipe(csv())
        .on("data", (data) => {
          const normalizedData = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
              key.replace(/^\uFEFF/, ""),
              value,
            ])
          );
          results.push(normalizedData);
        })
        .on("end", () => resolve())
        .on("error", (error) => reject(error));
    });

    const validRoles = ["Admin", "Staff", "PO", "Student"];
    const addedUsers: string[] = [];
    const failedUsers: { email: string; reason: string }[] = [];

    await prisma.$transaction(async (prisma) => {
      for (const user of results) {
        try {
          if (!validRoles.includes(user.role)) {
            failedUsers.push({ email: user.email, reason: "Undefined Role" });
            continue;
          }

          const inactiveUser = await prisma.user.findFirst({
            where: {
              OR: [
                { email: user.email, isActive: false },
                { username: user.username, isActive: false },
              ],
            },
          });

          if (inactiveUser) {
            failedUsers.push({
              email: user.email,
              reason: "Inactive user found",
            });
            continue;
          }

          const existingUser = await prisma.user.findFirst({
            where: {
              OR: [
                { email: user.email, isActive: true },
                { username: user.username, isActive: true },
              ],
            },
          });

          if (existingUser) {
            failedUsers.push({
              email: user.email,
              reason: "User already exists",
            });
            continue;
          }

          const hashedPassword = await bcryptjs.hash(user.password, 10);

          const createdUser = await prisma.user.create({
            data: {
              email: user.email,
              password: hashedPassword,
              name: user.name,
              username: user.username,
              role: user.role,
              isActive: true,
            },
          });

          if (user.role === "Student") {
            await prisma.studentDetails.create({
              data: {
                id: createdUser.id,
                email: createdUser.email,
                username: createdUser.username,
                name: createdUser.name,
              },
            });
          }

          if (user.role === "Staff") {
            await prisma.staffDetails.create({
              data: {
                id: createdUser.id,
                email: createdUser.email,
                username: createdUser.username,
                name: createdUser.name,
              },
            });
          }
          addedUsers.push(user.email);
          console.log("Added user: ", user.name);
        } catch (error: any) {
          failedUsers.push({ email: user.email, reason: error.message });
        }
      }
    });

    const totalUsers = results.length;
    const addedUsersLen = addedUsers.length;
    const failedUsersLen = failedUsers.length;
    console.log(`Total users processed: ${results.length}`);
    console.log(`Users added successfully: ${addedUsers.length}`);
    console.log(`Failed users: ${failedUsers.length}`);

    return NextResponse.json(
      {
        success: true,
        addedUsersLen,
        failedUsersLen,
        totalProcessed: results.length,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
