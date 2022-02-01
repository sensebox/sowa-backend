/*
  Warnings:

  - Added the required column `label` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "label" VARCHAR(255) NOT NULL;
