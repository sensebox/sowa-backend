-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "Domain" ADD COLUMN     "validation" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Sensor" ADD COLUMN     "datasheet" TEXT,
ADD COLUMN     "image" TEXT;
