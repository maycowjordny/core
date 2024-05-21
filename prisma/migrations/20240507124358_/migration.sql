/*
  Warnings:

  - You are about to drop the column `isActive` on the `EMPLOYEE` table. All the data in the column will be lost.
  - You are about to drop the column `IDT_WORK_PERIOD` on the `WORK_PERIOD_REGISTER` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "WORK_PERIOD_REGISTER" DROP CONSTRAINT "WORK_PERIOD_REGISTER_IDT_WORK_PERIOD_fkey";

-- AlterTable
ALTER TABLE "EMPLOYEE" DROP COLUMN "isActive",
ADD COLUMN     "FLG_IS_ACTIVE" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "WORK_PERIOD_REGISTER" DROP COLUMN "IDT_WORK_PERIOD",
ADD COLUMN     "COD_WORK_PERIOD" TEXT;

-- CreateTable
CREATE TABLE "_WorkPeriodToWorkPeriodRegister" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_WorkPeriodToWorkPeriodRegister_AB_unique" ON "_WorkPeriodToWorkPeriodRegister"("A", "B");

-- CreateIndex
CREATE INDEX "_WorkPeriodToWorkPeriodRegister_B_index" ON "_WorkPeriodToWorkPeriodRegister"("B");

-- AddForeignKey
ALTER TABLE "_WorkPeriodToWorkPeriodRegister" ADD CONSTRAINT "_WorkPeriodToWorkPeriodRegister_A_fkey" FOREIGN KEY ("A") REFERENCES "WORK_PERIOD"("IDT_WORK_PERIOD") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkPeriodToWorkPeriodRegister" ADD CONSTRAINT "_WorkPeriodToWorkPeriodRegister_B_fkey" FOREIGN KEY ("B") REFERENCES "WORK_PERIOD_REGISTER"("IDT_WORK_PERIOD_REGISTER") ON DELETE CASCADE ON UPDATE CASCADE;
