import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function GET(request: NextRequest) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;
  if (userRole !== "Student") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    if (!studentId) {
      return NextResponse.json(
        { error: "studentId is required" },
        { status: 400 }
      );
    }

    const coreSubjects = await prisma.studentDetails.findUnique({
      where: { id: studentId },
      select: {
        courseName: true,
        batchName: true,
        course: {
          select: {
            subjects: {
              where: {
                isElective: false,
              },
              select: {
                subjectId: true,
                subjectName: true,
                subjectCode: true,
                semester: true,
                staff: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        batch: {
          select: {
            currentSemester: true,
            subjects: {
              select: {
                subject: {
                  select: {
                    subjectId: true,
                    subjectName: true,
                    subjectCode: true,
                    semester: true,
                    staff: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                      },
                    },
                  },
                },
                semester: true,
              },
            },
            staffMembers: {
              select: {
                id: true,
                name: true,
                email: true,
                subjects: {
                  select: {
                    subjectId: true,
                    subjectName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!coreSubjects) {
      throw new Error("Student not found");
    }

    // Fetch elective choices for the student's current semester
    const electiveChoices = await prisma.electiveSubjectChoice.findMany({
      where: {
        studentId,
        electiveGroup: {
          semester: coreSubjects.batch?.currentSemester,
        },
      },
      select: {
        subject: {
          select: {
            subjectId: true,
            subjectName: true,
            subjectCode: true,
            semester: true,
            staff: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    const staffMap = new Map();
    coreSubjects.batch?.staffMembers.forEach((staff) => {
      staff.subjects.forEach((subject) => {
        if (!staffMap.has(subject.subjectId)) {
          staffMap.set(subject.subjectId, [
            {
              id: staff.id,
              name: staff.name,
              email: staff.email,
            },
          ]);
        } else {
          staffMap.get(subject.subjectId).push({
            id: staff.id,
            name: staff.name,
            email: staff.email,
          });
        }
      });
    });

    const allSubjects = [
      ...(coreSubjects.course?.subjects || []),
      ...(coreSubjects.batch?.subjects.map((bs) => ({
        ...bs.subject,
        semester: bs.semester,
      })) || []),
    ];

    const filteredSubjects = allSubjects.filter(
      (subject) =>
        subject.semester === coreSubjects.batch?.currentSemester
    );

    // Combine core subjects with elective choices
    const allCoreAndElectiveSubjects = [
      ...filteredSubjects,
      ...electiveChoices.map((choice) => choice.subject),
    ];

    const uniqueSubjects = allCoreAndElectiveSubjects.reduce(
      (acc, subject) => {
        if (!acc.some((s) => s.subjectId === subject.subjectId)) {
          const staffFromMap = staffMap.get(subject.subjectId) || [];
          const subjectStaff = subject.staff || [];
          const combinedStaff = [...staffFromMap, ...subjectStaff].filter(
            (staff, index, self) =>
              index === self.findIndex((t) => t.id === staff.id)
          );

          acc.push({
            subjectId: subject.subjectId,
            subjectName: subject.subjectName,
            subjectCode: subject.subjectCode,
            semester: subject.semester || 0,
            staff: combinedStaff.length > 0 ? combinedStaff : "NA",
          });
        }
        return acc;
      },
      [] as Array<{
        subjectId: string;
        subjectName: string;
        subjectCode: string;
        semester: number;
        staff: Array<{ id: string; name: string; email: string }> | "NA";
      }>
    );

    return NextResponse.json({
      studentId,
      courseName: coreSubjects.courseName,
      batchName: coreSubjects.batchName,
      subjects: uniqueSubjects,
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching subjects" },
      { status: 500 }
    );
  }
}