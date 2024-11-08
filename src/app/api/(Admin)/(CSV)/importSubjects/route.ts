import { NextRequest, NextResponse } from "next/server";
import csv from "csv-parser";
import { Readable } from "stream";
import { prisma } from "@/lib/prisma";
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

  const headers = new Headers();
  headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );

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

    var successRate = 0;
    var updateRate = 0;
    const failedSubjects: {
      subjectName: string;
      subjectCode: string;
      semester: number;
      courseName: string;
      reason: string;
    }[] = [];
    const duplicateSubjects: {
      subjectName: string;
      subjectCode: string;
      semester: number;
      courseName: string;
      reason: string;
    }[] = [];

    await prisma.$transaction(async (prisma) => {
      for (const subject of results) {
        try {
          // First, fetch the courseId
          const courseId = await prisma.course.findUnique({
            where: {
              courseName: subject.courseName,
            },
            select: {
              courseId: true,
            },
          });

          if (!courseId?.courseId) {
            throw new Error("courseId is required and must be defined.");
          }

          const inactiveSubject = await prisma.subject.findFirst({
            where: {
              subjectName: subject.subjectName,
              isActive: false,
            },
          });

          if (inactiveSubject) {
            failedSubjects.push({
              subjectName: subject.subjectName,
              subjectCode: subject.subjectCode,
              semester: subject.semester,
              courseName: subject.courseName,
              reason: "Inactive Subject found",
            });
            continue;
          }

          const existingSubject = await prisma.subject.findFirst({
            where: {
              subjectName: subject.subjectName,
              semester: parseInt(subject.semester),
              courseId: courseId.courseId,
            },
          });

          const hasValidElectiveGroup =
            subject.electiveGroupId && subject.electiveGroupId.trim() !== "";

          const subjectData = {
            subjectCode: subject.subjectCode,
            semester: parseInt(subject.semester),
            courseId: courseId.courseId,

            isElective: hasValidElectiveGroup
              ? true
              : subject.isElective === "true" || subject.isElective === "1",

            ...(hasValidElectiveGroup
              ? { electiveGroupId: subject.electiveGroupId.trim() }
              : { electiveGroupId: null }),
          };

          if (existingSubject) {
            await prisma.subject.update({
              where: {
                subjectId: existingSubject.subjectId,
              },
              data: subjectData,
            });
            updateRate++;
            duplicateSubjects.push({
              subjectName: subject.subjectName,
              subjectCode: subject.subjectCode,
              semester: subject.semester,
              courseName: subject.courseName,
              reason: `Subject updated with ${
                hasValidElectiveGroup ? "elective group" : ""
              } information`,
            });
            continue;
          }

          await prisma.subject.create({
            data: {
              subjectName: subject.subjectName,
              ...subjectData,
            },
          });
          successRate++;
        } catch (error: any) {
          failedSubjects.push({
            subjectName: subject.subjectName,
            courseName: subject.courseName,
            subjectCode: subject.subjectCode,
            semester: subject.semester,
            reason: error.message,
          });
        }
      }
    });

    const failureRate = failedSubjects.length;
    const duplicationRate = duplicateSubjects.length;

    return NextResponse.json(
      {
        success: true,
        successRate,
        updateRate,
        failureRate,
        duplicationRate,
        duplicateSubjects,
        failedSubjects,
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
