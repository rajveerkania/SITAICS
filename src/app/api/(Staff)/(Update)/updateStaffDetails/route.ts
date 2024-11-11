import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  const reqBody = await request.json();
  const { staffId, batchId, isBatchCoordinator, selectedSubjectIds } = reqBody;

  try {
    const updateData: any = {
      isBatchCoordinator,
      isSemesterUpdated: false,
    };

    if (batchId && isBatchCoordinator) {
      updateData.batchId = batchId;
    }

    if (selectedSubjectIds && selectedSubjectIds.length > 0) {
      const currentStaff = await prisma.staffDetails.findUnique({
        where: { id: staffId },
        include: { subjects: true },
      });

      if (!currentStaff) {
        return NextResponse.json(
          { message: "Staff not found" },
          { status: 404 }
        );
      }

      const subjectsToAssign = await prisma.subject.findMany({
        where: {
          subjectId: { in: selectedSubjectIds },
        },
      });

      const subjectsToDisconnect = currentStaff.subjects.filter(
        (subject) => !selectedSubjectIds.includes(subject.subjectId)
      );

      const subjectsToConnect = subjectsToAssign.map((subject) => ({
        subjectId: subject.subjectId,
      }));

      updateData.subjects = {
        disconnect: subjectsToDisconnect.map((subject) => ({
          subjectId: subject.subjectId,
        })),
        connect: subjectsToConnect,
      };
    }

    await prisma.staffDetails.update({
      where: { id: staffId },
      data: updateData,
    });

    return NextResponse.json(
      { message: "Subjects and staff information updated", success: true },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
};
