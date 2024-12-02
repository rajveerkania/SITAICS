import { PrismaClient, Role } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request, 
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log('Received ID:', params.id);

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        studentDetails: {
          include: {
            course: true,
            batch: true,
            electiveChoices: {
              include: {
                subject: true,
                electiveGroup: true,
              },
            },
            results: true, // Include results here
          },
        },
        staffDetails: {
          include: {
            batch: true,
            subjects: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let roleDetails: any = {};

    if (user.role === Role.Student && user.studentDetails) {
      const {
        id: _id,
        course: _course,
        batch: _batch,
        ...studentDetails
      } = user.studentDetails;

      roleDetails = {
        ...studentDetails,
        contactNo: user.studentDetails.contactNo,
        courseName: user.studentDetails.course?.courseName,
        batchName: user.studentDetails.batch?.batchName,
        electiveSubjects: user.studentDetails.electiveChoices.map((choice) => ({
          groupName: choice.electiveGroup.groupName,
          subjectName: choice.subject.subjectName,
          subjectCode: choice.subject.subjectCode,
        })),
        achievements: user.studentDetails.achievements, // Include achievements
        results: user.studentDetails.results.map(result => ({
          semester: result.semester,
          resultFile: result.resultFile.toString(), // You can adjust this depending on how you want to return the result file
          uploadedAt: result.uploadedAt,
          isRepeater: result.isRepeater,
        })),
      };
    } else if (user.role === Role.Staff && user.staffDetails) {
      const {
        id: _id,
        batch: _batch,
        ...staffDetails
      } = user.staffDetails;

      roleDetails = {
        ...staffDetails,
        subjects: user.staffDetails.subjects.map((subject) => ({
          subjectName: subject.subjectName,
          subjectCode: subject.subjectCode,
          semester: subject.semester,
        })),
        batchName: user.staffDetails.batch?.batchName,
        achievements: user.staffDetails.achievements, // Include achievements
      };
    }

    const detailedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roleDetails,
    };
    console.log(detailedUser);
    return NextResponse.json(detailedUser);
  } catch (error: any) {
    console.error("Error fetching user details:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const data = await request.json();
    const { roleDetails, ...userData } = data;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        studentDetails: true,
        staffDetails: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: userData.name,
        isActive: userData.isActive,
      },
    });

    // Update achievements for both student and staff based on role
    if (user.role === Role.Student) {
      await prisma.studentDetails.update({
        where: { id },
        data: {
          contactNo: roleDetails.contactNo,
          address: roleDetails.address,
          city: roleDetails.city,
          state: roleDetails.state,
          pinCode: roleDetails.pinCode ? parseInt(roleDetails.pinCode) : null,
          fatherName: roleDetails.fatherName,
          motherName: roleDetails.motherName,
          dateOfBirth: roleDetails.dateOfBirth,
          gender: roleDetails.gender,
          achievements: roleDetails.achievements, // Update achievements
        },
      });

      // Update or create the result (assuming results array is provided in roleDetails)
      for (const result of roleDetails.results || []) {
        if (result.id) {
          await prisma.result.update({
            where: { id: result.id },
            data: {
              semester: result.semester,
              resultFile: result.resultFile, // Handle the file properly (e.g., upload to a storage service)
              isRepeater: result.isRepeater,
            },
          });
        } else {
          await prisma.result.create({
            data: {
              studentId: id,
              semester: result.semester,
              resultFile: result.resultFile, // Handle the file properly
              isRepeater: result.isRepeater,
            },
          });
        }
      }
    } else if (user.role === Role.Staff) {
      await prisma.staffDetails.update({
        where: { id },
        data: {
          contactNo: roleDetails.contactNo,
          address: roleDetails.address,
          city: roleDetails.city,
          state: roleDetails.state,
          pinCode: roleDetails.pinCode ? parseInt(roleDetails.pinCode) : null,
          dateOfBirth: roleDetails.dateOfBirth,
          gender: roleDetails.gender,
          achievements: roleDetails.achievements, // Update achievements
        },
      });
    }

    // Fetch updated user details and return
    return await GET(request, { params: { id } });
  } catch (error: any) {
    console.error("Error updating user details:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
