-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "description" VARCHAR(4096),
ADD COLUMN     "markdown" VARCHAR(4096),
ADD COLUMN     "validation" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Sensor" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "validation" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Phenomenon" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(255),
    "label" TEXT NOT NULL,
    "markdown" VARCHAR(4096),
    "validation" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Phenomenon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RangeOfValues" (
    "min" INTEGER NOT NULL,
    "max" INTEGER NOT NULL,
    "unitId" INTEGER NOT NULL,
    "phenomenonId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Domain" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DeviceToSensor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PhenomenonToSensor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_DomainToPhenomenon" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "RangeOfValues_min_max_key" ON "RangeOfValues"("min", "max");

-- CreateIndex
CREATE UNIQUE INDEX "_DeviceToSensor_AB_unique" ON "_DeviceToSensor"("A", "B");

-- CreateIndex
CREATE INDEX "_DeviceToSensor_B_index" ON "_DeviceToSensor"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PhenomenonToSensor_AB_unique" ON "_PhenomenonToSensor"("A", "B");

-- CreateIndex
CREATE INDEX "_PhenomenonToSensor_B_index" ON "_PhenomenonToSensor"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DomainToPhenomenon_AB_unique" ON "_DomainToPhenomenon"("A", "B");

-- CreateIndex
CREATE INDEX "_DomainToPhenomenon_B_index" ON "_DomainToPhenomenon"("B");

-- AddForeignKey
ALTER TABLE "RangeOfValues" ADD CONSTRAINT "RangeOfValues_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RangeOfValues" ADD CONSTRAINT "RangeOfValues_phenomenonId_fkey" FOREIGN KEY ("phenomenonId") REFERENCES "Phenomenon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeviceToSensor" ADD FOREIGN KEY ("A") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeviceToSensor" ADD FOREIGN KEY ("B") REFERENCES "Sensor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PhenomenonToSensor" ADD FOREIGN KEY ("A") REFERENCES "Phenomenon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PhenomenonToSensor" ADD FOREIGN KEY ("B") REFERENCES "Sensor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DomainToPhenomenon" ADD FOREIGN KEY ("A") REFERENCES "Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DomainToPhenomenon" ADD FOREIGN KEY ("B") REFERENCES "Phenomenon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
