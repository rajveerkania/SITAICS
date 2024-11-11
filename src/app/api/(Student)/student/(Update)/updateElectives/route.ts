import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function PATCH(request: Request) {
  const decodedUser = verifyToken();
  const userRole = decodedUser?.role;

  if (userRole !== "Student") {
    return NextResponse.json({ message: "Access Denied!" }, { status: 403 });
  }
  try {
    const { studentId, electiveChoices } = await request.json();

    if (!studentId || !electiveChoices || !Array.isArray(electiveChoices)) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (prisma) => {
      await prisma.electiveSubjectChoice.deleteMany({
        where: { studentId },
      });

      const newChoices = electiveChoices.map((choice) => ({
        studentId,
        electiveGroupId: choice.electiveGroupId,
        subjectId: choice.subjectId,
      }));

      await prisma.electiveSubjectChoice.createMany({
        data: newChoices,
      });

      const user = await prisma.studentDetails.update({
        where: { id: studentId },
        data: { isSemesterUpdated: false },
      });

      console.log(user);
    });

    return NextResponse.json(
      { success: true, message: "Electives updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating electives:", error);
    return NextResponse.json(
      { error: "Failed to update electives" },
      { status: 500 }
    );
  }
}
