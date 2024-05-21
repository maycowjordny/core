/*
  Warnings:

  - A unique constraint covering the columns `[COD_WORK_PERIOD,IND_WEEKDAY]` on the table `WORK_PERIOD` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "EMPLOYEE" DROP CONSTRAINT "EMPLOYEE_COD_WORK_PERIOD_fkey";

-- DropIndex
DROP INDEX "EMPLOYEE_COD_WORK_PERIOD_key";

-- DropIndex
DROP INDEX "WORK_PERIOD_COD_WORK_PERIOD_key";

-- DropIndex
DROP INDEX "WORK_PERIOD_IND_WEEKDAY_key";

-- CreateTable
CREATE TABLE "_EmployeeToWorkPeriod" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EmployeeToWorkPeriod_AB_unique" ON "_EmployeeToWorkPeriod"("A", "B");

-- CreateIndex
CREATE INDEX "_EmployeeToWorkPeriod_B_index" ON "_EmployeeToWorkPeriod"("B");

-- CreateIndex
CREATE UNIQUE INDEX "WORK_PERIOD_COD_WORK_PERIOD_IND_WEEKDAY_key" ON "WORK_PERIOD"("COD_WORK_PERIOD", "IND_WEEKDAY");

-- AddForeignKey
ALTER TABLE "_EmployeeToWorkPeriod" ADD CONSTRAINT "_EmployeeToWorkPeriod_A_fkey" FOREIGN KEY ("A") REFERENCES "EMPLOYEE"("IDT_EMPLOYEE") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeToWorkPeriod" ADD CONSTRAINT "_EmployeeToWorkPeriod_B_fkey" FOREIGN KEY ("B") REFERENCES "WORK_PERIOD"("IDT_WORK_PERIOD") ON DELETE CASCADE ON UPDATE CASCADE;
