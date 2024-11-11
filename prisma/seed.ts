import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Upsert Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: "rajveer@gmail.com" },
    update: {},
    create: {
      email: "rajveer@gmail.com",
      password: await bcrypt.hash("rajveer", 10),
      name: "Rajveer Kania",
      role: Role.Admin,
      username: "rajveerkania",
    },
  });

  console.log({
    adminUser,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
