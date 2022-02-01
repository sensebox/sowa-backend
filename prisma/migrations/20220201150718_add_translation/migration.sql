/*
  Warnings:

  - Added the required column `translationId` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "translationId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_translationId_languageId_fkey" FOREIGN KEY ("translationId", "languageId") REFERENCES "Translation"("id", "languageId") ON DELETE RESTRICT ON UPDATE CASCADE;
