/*
  Warnings:

  - A unique constraint covering the columns `[batchName]` on the table `Batch` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Batch_batchName_key" ON "Batch"("batchName");
