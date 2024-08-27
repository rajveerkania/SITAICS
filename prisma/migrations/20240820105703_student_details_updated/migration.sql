/*
  Warnings:

  - You are about to drop the column `achievement` on the `StudentDetails` table. All the data in the column will be lost.
  - You are about to drop the column `course` on the `StudentDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StudentDetails" DROP COLUMN "achievement",
DROP COLUMN "course",
ADD COLUMN     "achievements" TEXT,
ADD COLUMN     "batch" TEXT,
ADD COLUMN     "isProfileCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "results" JSONB;
