import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

// Custom error type guard
function isPrismaError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}

// Error handler function
function handleError(error: unknown) {
  console.error("Operation failed:", error);

  if (isPrismaError(error)) {
    // Handle Prisma-specific errors
    switch (error.code) {
      case 'P2002':
        return NextResponse.json(
          { error: "Subject code must be unique" },
          { status: 400 }
        );
      case 'P2003':
        return NextResponse.json(
          { error: "Cannot delete subject as it is referenced by other records" },
          { status: 400 }
        );
      case 'P2025':
        return NextResponse.json(
          { error: "Record not found" },
          { status: 404 }
        );
      default:
        return NextResponse.json(
          { error: "Database operation failed" },
          { status: 500 }
        );
    }
  }

  // Handle generic errors
  return NextResponse.json(
    { error: "An unexpected error occurred" },
    { status: 500 }
  );
}

// GET endpoint to fetch subjects
export async function GET(req: Request) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;

  if (!["Admin", "Staff"].includes(userRole!)) {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const batchId = searchParams.get("batchId");

  try {
    let subjects;

    if (batchId) {
      subjects = await prisma.batchSubject.findMany({
        where: { batchId },
        include: {
          subject: {
            select: {
              subjectId: true,
              subjectName: true,
              subjectCode: true,
              semester: true,
              isElective: true,
              electiveGroup: {
                select: {
                  electiveGroupId: true,
                  groupName: true,
                },
              },
              course: {
                select: {
                  courseId: true,
                  courseName: true,
                },
              },
            },
          },
        },
      });

      if (subjects.length === 0) {
        return NextResponse.json(
          { message: "No subjects found for this batch" },
          { status: 406 }
        );
      }

      const formattedSubjects = subjects.map(({ subject }) => ({
        subjectId: subject.subjectId,
        subjectName: subject.subjectName,
        subjectCode: subject.subjectCode,
        semester: subject.semester,
        courseName: subject.course?.courseName || "N/A",
        courseId: subject.course?.courseId,
        isElective: subject.isElective,
        electiveGroup: subject.electiveGroup,
      }));

      return NextResponse.json(formattedSubjects, { status: 200 });
    } else {
      subjects = await prisma.subject.findMany({
        select: {
          subjectId: true,
          subjectName: true,
          subjectCode: true,
          semester: true,
          isElective: true,
          electiveGroup: {
            select: {
              electiveGroupId: true,
              groupName: true,
            },
          },
          course: {
            select: {
              courseId: true,
              courseName: true,
            },
          },
        },
      });

      const formattedSubjects = subjects.map((subject) => ({
        subjectId: subject.subjectId,
        subjectName: subject.subjectName,
        subjectCode: subject.subjectCode,
        semester: subject.semester,
        courseName: subject.course?.courseName || "N/A",
        courseId: subject.course?.courseId,
        isElective: subject.isElective,
        electiveGroup: subject.electiveGroup,
      }));

      return NextResponse.json(formattedSubjects, { status: 200 });
    }
  } catch (error: unknown) {
    return handleError(error);
  } finally {
    await prisma.$disconnect();
  }
}

// PUT endpoint to update subject
export async function PUT(req: Request) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;

  if (userRole !== "Admin") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      subjectId,
      subjectName,
      subjectCode,
      semester,
      courseName,
      isElective,
      electiveGroupName,
    } = body;

    const course = await prisma.course.findUnique({
      where: { courseName },
      select: { courseId: true },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    let electiveGroupId: string | null = null;
    if (isElective && electiveGroupName) {
      let electiveGroup = await prisma.electiveGroup.findFirst({
        where: {
          groupName: electiveGroupName,
          courseId: course.courseId,
          semester,
        },
      });

      if (!electiveGroup) {
        electiveGroup = await prisma.electiveGroup.create({
          data: {
            groupName: electiveGroupName,
            courseId: course.courseId,
            semester,
          },
        });
      }

      electiveGroupId = electiveGroup.electiveGroupId;
    }

    const updatedSubject = await prisma.subject.update({
      where: { subjectId },
      data: {
        subjectName,
        subjectCode,
        semester,
        courseId: course.courseId,
        isElective,
        electiveGroupId,
      },
      include: {
        course: {
          select: {
            courseName: true,
          },
        },
        electiveGroup: {
          select: {
            groupName: true,
          },
        },
      },
    });

    const formattedSubject = {
      subjectId: updatedSubject.subjectId,
      subjectName: updatedSubject.subjectName,
      subjectCode: updatedSubject.subjectCode,
      semester: updatedSubject.semester,
      courseName: updatedSubject.course.courseName,
      isElective: updatedSubject.isElective,
      electiveGroup: updatedSubject.electiveGroup,
    };

    return NextResponse.json(formattedSubject, { status: 200 });
  } catch (error: unknown) {
    return handleError(error);
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE endpoint to delete subject
export async function DELETE(req: Request) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;

  if (userRole !== "Admin") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get("subjectId");

  if (!subjectId) {
    return NextResponse.json(
      { error: "Subject ID is required" },
      { status: 400 }
    );
  }

  try {
    const existingSubject = await prisma.subject.findUnique({
      where: { subjectId },
    });

    if (!existingSubject) {
      return NextResponse.json(
        { error: "Subject not found" },
        { status: 404 }
      );
    }

    await prisma.subject.delete({
      where: { subjectId },
    });

    return NextResponse.json(
      { message: "Subject deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return handleError(error);
  } finally {
    await prisma.$disconnect();
  }
}

// POST endpoint to create new subject
export async function POST(req: Request) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;

  if (userRole !== "Admin") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      subjectName,
      subjectCode,
      semester,
      courseName,
      isElective,
      electiveGroupName,
    } = body;

    if (!subjectName || !subjectCode || !semester || !courseName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: { courseName },
      select: { courseId: true },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    let electiveGroupId: string | null = null;
    if (isElective && electiveGroupName) {
      let electiveGroup = await prisma.electiveGroup.findFirst({
        where: {
          groupName: electiveGroupName,
          courseId: course.courseId,
          semester,
        },
      });

      if (!electiveGroup) {
        electiveGroup = await prisma.electiveGroup.create({
          data: {
            groupName: electiveGroupName,
            courseId: course.courseId,
            semester,
          },
        });
      }

      electiveGroupId = electiveGroup.electiveGroupId;
    }

    const newSubject = await prisma.subject.create({
      data: {
        subjectName,
        subjectCode,
        semester,
        courseId: course.courseId,
        isElective: isElective || false,
        electiveGroupId,
      },
      include: {
        course: {
          select: {
            courseName: true,
          },
        },
        electiveGroup: {
          select: {
            groupName: true,
          },
        },
      },
    });

    const formattedSubject = {
      subjectId: newSubject.subjectId,
      subjectName: newSubject.subjectName,
      subjectCode: newSubject.subjectCode,
      semester: newSubject.semester,
      courseName: newSubject.course.courseName,
      isElective: newSubject.isElective,
      electiveGroup: newSubject.electiveGroup,
    };

    return NextResponse.json(formattedSubject, { status: 201 });
  } catch (error: unknown) {
    return handleError(error);
  } finally {
    await prisma.$disconnect();
  }
}