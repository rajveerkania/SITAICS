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
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
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
          // Fix for BOM issue
          const normalizedData = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
              key.replace(/^\uFEFF/, ""), // Remove BOM from the key
              value,
            ])
          );
          results.push(normalizedData);
        })
        .on("end", () => resolve())
        .on("error", (error) => reject(error));
    });

    console.log("Parsed CSV results:", JSON.stringify(results, null, 2));

    const validRoles = ["Admin", "Staff", "PO", "Student"];
    const createdUsers: any[] = [];
    const errors: any[] = [];

    await prisma.$transaction(async (prisma) => {
      for (const user of results) {
        try {
          console.log("Printing individual user", user);
          console.log("Processing user:", user.email);

          if (!validRoles.includes(user.role)) {
            throw new Error(
              `Invalid role for user ${user.email}: ${user.role}`
            );
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
            throw new Error(`Inactive user found with email: ${user.email}`);
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
            throw new Error(`User already exists with email: ${user.email}`);
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

          createdUsers.push(createdUser);
        } catch (error: any) {
          console.error(`Error processing user ${user.email}:`, error.message);
          errors.push({ email: user.email, error: error.message });
        }
      }
    });

    return NextResponse.json({
      success: true,
      createdUsers,
      errors,
    });
  } catch (error) {
    console.error("Error in file processing:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
