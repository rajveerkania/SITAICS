import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminUser = await prisma.user.upsert({
    where: { email: "rajveer@gmail.com" },
    update: {},
    create: {
      email: "rajveer@gmail.com",
      password: "$2a$10$IyNw/pvFmW/k4Mo1XwDtCeaTdSR79VnWelwRrJv6ZTPw8Q8kS/Fau",
      name: "Rajveer Kania",
      role: Role.Admin,
      username: "rajveerkania",
    },
  });

  const courses = [];
  const batches = [];
  const students = [];
  const staffMembers = [];

  for (let i = 1; i <= 5; i++) {
    const course = await prisma.course.upsert({
      where: { courseName: `Course ${i}` },
      update: {},
      create: {
        courseName: `Course ${i}`
      },
    });
    courses.push(course);

    const batch = await prisma.batch.upsert({
      where: { batchName: `Batch ${i}` },
      update: {
        courseId: course.courseId,
        batchDuration: 4,
        currentSemester: 1,
      },
      create: {
        batchName: `Batch ${i}`,
        courseId: course.courseId,
        batchDuration: 4,
        currentSemester: 1,
      },
    });
    batches.push(batch);

    for (let j = 1; j <= 10; j++) {
      const email = `student${i}${j}@example.com`;
      const username = `student${i}${j}`;

      const existingStudent = await prisma.user.findUnique({
        where: { email },
      });

      if (!existingStudent) {
        const student = await prisma.user.create({
          data: {
            email,
            password: "$2a$10$randompassword",
            name: `Student ${i}${j}`,
            role: Role.Student,
            username,
            studentDetails: {
              create: {
                email,
                username,
                name: `Student ${i}${j}`,
                enrollmentNumber: `CS2023${i}${j}`,
                courseName: course.courseName,
                batchName: batch.batchName,
              },
            },
          },
        });
        students.push(student);
      }
    }

    const staffEmail = `staff${i}@example.com`;

    const existingStaff = await prisma.user.findUnique({
      where: { email: staffEmail },
    });

    if (!existingStaff) {
      const staffUser = await prisma.user.create({
        data: {
          email: staffEmail,
          password: "$2a$10$randompassword",
          name: `Staff Member ${i}`,
          role: Role.Staff,
          username: `staff${i}`,
          staffDetails: {
            create: {
              email: staffEmail,
              username: `staff${i}`,
              name: `Staff Member ${i}`,
              isBatchCoordinator: true,
              batchId: batch.batchId,
            },
          },
        },
      });
      staffMembers.push(staffUser);
    }
  }

  console.log({ adminUser, courses, batches, students, staffMembers });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
