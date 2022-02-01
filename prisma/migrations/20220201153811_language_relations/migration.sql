/*
  Warnings:

  - You are about to drop the column `languageId` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `translationId` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `languageId` on the `Translation` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Translation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_translationId_languageId_fkey";

-- DropForeignKey
ALTER TABLE "Translation" DROP CONSTRAINT "Translation_languageId_fkey";

-- DropIndex
DROP INDEX "Translation_id_languageId_key";

-- AlterTable
ALTER TABLE "Device" DROP COLUMN "languageId",
DROP COLUMN "translationId";

-- AlterTable
CREATE SEQUENCE "translation_id_seq";
ALTER TABLE "Translation" DROP COLUMN "languageId",
DROP COLUMN "text",
ADD COLUMN     "deviceId" INTEGER,
ALTER COLUMN "id" SET DEFAULT nextval('translation_id_seq'),
ADD CONSTRAINT "Translation_pkey" PRIMARY KEY ("id");
ALTER SEQUENCE "translation_id_seq" OWNED BY "Translation"."id";

-- CreateTable
CREATE TABLE "TranslationItem" (
    "id" SERIAL NOT NULL,
    "translationId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "text" VARCHAR(4096) NOT NULL,

    CONSTRAINT "TranslationItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslationItem" ADD CONSTRAINT "TranslationItem_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslationItem" ADD CONSTRAINT "TranslationItem_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
