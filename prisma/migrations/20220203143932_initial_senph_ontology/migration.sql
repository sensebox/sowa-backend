-- CreateTable
CREATE TABLE "Device" (
    "id" SERIAL NOT NULL,
    "validation" BOOLEAN NOT NULL DEFAULT false,
    "labelId" INTEGER,
    "descriptionId" INTEGER,
    "markdownId" INTEGER,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sensor" (
    "id" SERIAL NOT NULL,
    "manufacturer" TEXT,
    "lifePeriod" INTEGER,
    "validation" BOOLEAN NOT NULL DEFAULT false,
    "labelId" INTEGER,
    "descriptionId" INTEGER,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Element" (
    "id" SERIAL NOT NULL,
    "accuracy" DOUBLE PRECISION,
    "sensorId" INTEGER NOT NULL,
    "phenomenonId" INTEGER NOT NULL,
    "unitId" INTEGER,

    CONSTRAINT "Element_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Phenomenon" (
    "id" SERIAL NOT NULL,
    "validation" BOOLEAN NOT NULL DEFAULT false,
    "labelId" INTEGER,
    "descriptionId" INTEGER,
    "markdownId" INTEGER,

    CONSTRAINT "Phenomenon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RangeOfValues" (
    "id" SERIAL NOT NULL,
    "min" INTEGER,
    "max" INTEGER,
    "unitId" INTEGER NOT NULL,
    "phenomenonId" INTEGER NOT NULL,

    CONSTRAINT "RangeOfValues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Domain" (
    "id" SERIAL NOT NULL,
    "labelId" INTEGER,
    "descriptionId" INTEGER,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "code" VARCHAR(2) NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Translation" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranslationItem" (
    "languageCode" TEXT NOT NULL,
    "text" VARCHAR(4096) NOT NULL,
    "translationId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_DeviceToSensor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_DomainToPhenomenon" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Device_labelId_key" ON "Device"("labelId");

-- CreateIndex
CREATE UNIQUE INDEX "Device_descriptionId_key" ON "Device"("descriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Device_markdownId_key" ON "Device"("markdownId");

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_labelId_key" ON "Sensor"("labelId");

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_descriptionId_key" ON "Sensor"("descriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Phenomenon_labelId_key" ON "Phenomenon"("labelId");

-- CreateIndex
CREATE UNIQUE INDEX "Phenomenon_descriptionId_key" ON "Phenomenon"("descriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Phenomenon_markdownId_key" ON "Phenomenon"("markdownId");

-- CreateIndex
CREATE UNIQUE INDEX "Domain_labelId_key" ON "Domain"("labelId");

-- CreateIndex
CREATE UNIQUE INDEX "Domain_descriptionId_key" ON "Domain"("descriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "TranslationItem_translationId_languageCode_key" ON "TranslationItem"("translationId", "languageCode");

-- CreateIndex
CREATE UNIQUE INDEX "_DeviceToSensor_AB_unique" ON "_DeviceToSensor"("A", "B");

-- CreateIndex
CREATE INDEX "_DeviceToSensor_B_index" ON "_DeviceToSensor"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DomainToPhenomenon_AB_unique" ON "_DomainToPhenomenon"("A", "B");

-- CreateIndex
CREATE INDEX "_DomainToPhenomenon_B_index" ON "_DomainToPhenomenon"("B");

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Translation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_descriptionId_fkey" FOREIGN KEY ("descriptionId") REFERENCES "Translation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_markdownId_fkey" FOREIGN KEY ("markdownId") REFERENCES "Translation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Translation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_descriptionId_fkey" FOREIGN KEY ("descriptionId") REFERENCES "Translation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Element" ADD CONSTRAINT "Element_phenomenonId_fkey" FOREIGN KEY ("phenomenonId") REFERENCES "Phenomenon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Element" ADD CONSTRAINT "Element_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "Sensor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Element" ADD CONSTRAINT "Element_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Phenomenon" ADD CONSTRAINT "Phenomenon_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Translation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Phenomenon" ADD CONSTRAINT "Phenomenon_descriptionId_fkey" FOREIGN KEY ("descriptionId") REFERENCES "Translation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Phenomenon" ADD CONSTRAINT "Phenomenon_markdownId_fkey" FOREIGN KEY ("markdownId") REFERENCES "Translation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RangeOfValues" ADD CONSTRAINT "RangeOfValues_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RangeOfValues" ADD CONSTRAINT "RangeOfValues_phenomenonId_fkey" FOREIGN KEY ("phenomenonId") REFERENCES "Phenomenon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Translation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_descriptionId_fkey" FOREIGN KEY ("descriptionId") REFERENCES "Translation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslationItem" ADD CONSTRAINT "TranslationItem_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "Language"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslationItem" ADD CONSTRAINT "TranslationItem_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeviceToSensor" ADD FOREIGN KEY ("A") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeviceToSensor" ADD FOREIGN KEY ("B") REFERENCES "Sensor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DomainToPhenomenon" ADD FOREIGN KEY ("A") REFERENCES "Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DomainToPhenomenon" ADD FOREIGN KEY ("B") REFERENCES "Phenomenon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
