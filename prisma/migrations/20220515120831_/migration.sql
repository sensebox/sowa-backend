/*
  Warnings:

  - A unique constraint covering the columns `[descriptionId]` on the table `Unit` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "contact" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "descriptionId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Unit_descriptionId_key" ON "Unit"("descriptionId");

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_descriptionId_fkey" FOREIGN KEY ("descriptionId") REFERENCES "Translation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
