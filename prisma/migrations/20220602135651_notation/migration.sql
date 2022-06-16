/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Domain` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Phenomenon` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Sensor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Unit` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Domain` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Phenomenon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Sensor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notation` to the `Unit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Unit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Domain" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Phenomenon" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Sensor" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "notation" VARCHAR(255) NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Domain_slug_key" ON "Domain"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Phenomenon_slug_key" ON "Phenomenon"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_slug_key" ON "Sensor"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_slug_key" ON "Unit"("slug");
