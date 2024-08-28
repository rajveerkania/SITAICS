import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a course
  const course = await prisma.course.create({
    data: {
      courseName: "Computer Science",
    },
  });

  // Create a batch
  const batch = await prisma.batch.create({
    data: {
      batchName: "CS2023",
      courseId: course.courseId,
      batchDuration: 4,
      currentSemester: 1,
    },
  });

  // Create a subject
  const subject = await prisma.subject.create({
    data: {
      subjectName: "Introduction to Programming",
      subjectCode: "CS101",
      semester: 1,
      courseId: course.courseId,
    },
  });

  // Create a batch subject relation
  await prisma.batchSubject.create({
    data: {
      batchId: batch.batchId,
      subjectId: subject.subjectId,
      semester: 1,
    },
  });

  // Create an admin user
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: "adminpassword", // Remember to hash passwords in a real application
      name: "Admin User",
      role: Role.Admin,
      username: "admin",
    },
  });

  // Create a student user
  const studentUser = await prisma.user.create({
    data: {
      email: "student@example.com",
      password: "studentpassword", // Remember to hash passwords in a real application
      name: "Student User",
      role: Role.Student,
      username: "student",
      studentDetails: {
        create: {
          email: "student@example.com",
          username: "student",
          name: "Student User",
          enrollmentNumber: "CS2023001",
          courseName: course.courseName,
          batchName: batch.batchName,
        },
      },
    },
  });

  // Create a staff user
  const staffUser = await prisma.user.create({
    data: {
      email: "staff@example.com",
      password: "staffpassword", // Remember to hash passwords in a real application
      name: "Staff User",
      role: Role.Staff,
      username: "staff",
      staffDetails: {
        create: {
          email: "staff@example.com",
          username: "staff",
          name: "Staff User",
          isBatchCoordinator: true,
          batchId: batch.batchId,
        },
      },
    },
  });

  console.log({ course, batch, subject, adminUser, studentUser, staffUser });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
