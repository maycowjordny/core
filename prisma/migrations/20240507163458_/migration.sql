/*
  Warnings:

  - You are about to drop the column `COD_WORK_PERIOD` on the `WORK_PERIOD_REGISTER` table. All the data in the column will be lost.
  - You are about to drop the `_WorkPeriodToWorkPeriodRegister` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_WorkPeriodToWorkPeriodRegister" DROP CONSTRAINT "_WorkPeriodToWorkPeriodRegister_A_fkey";

-- DropForeignKey
ALTER TABLE "_WorkPeriodToWorkPeriodRegister" DROP CONSTRAINT "_WorkPeriodToWorkPeriodRegister_B_fkey";

-- AlterTable
ALTER TABLE "WORK_PERIOD_REGISTER" DROP COLUMN "COD_WORK_PERIOD",
ADD COLUMN     "IDT_WORK_PERIOD" TEXT;

-- DropTable
DROP TABLE "_WorkPeriodToWorkPeriodRegister";

-- AddForeignKey
ALTER TABLE "WORK_PERIOD_REGISTER" ADD CONSTRAINT "WORK_PERIOD_REGISTER_IDT_WORK_PERIOD_fkey" FOREIGN KEY ("IDT_WORK_PERIOD") REFERENCES "WORK_PERIOD"("IDT_WORK_PERIOD") ON DELETE SET NULL ON UPDATE CASCADE;
