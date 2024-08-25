-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_courseId_fkey";

-- AlterTable
ALTER TABLE "StudentDetails" ADD COLUMN     "city" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "pinCode" INTEGER,
ADD COLUMN     "state" TEXT;
