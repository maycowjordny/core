import { SummariseEmployeeSalaryException } from "@/application/errors/summarise-employee-salary-exception";
import { findByEmployeeAndTimeWindowRequest } from "@/domain/interfaces/work-period-register";
import { MakeTimeTrackEmployeeMonthlyUseCase } from "../time-track-employee-monthly/make-time-track-employee-monthly-use-case";

export class SummariseEmployeeSalaryMonthly {
    constructor(private makeTimeTrackEmployeeMonthlyUseCase: MakeTimeTrackEmployeeMonthlyUseCase) { }

    private extraHours: number = 0;
    private lateHours: number = 0;
    private toleranceMinutes: number = 10 / 60; // decimal;

    async execute({ employeeId, endDate, startDate }: findByEmployeeAndTimeWindowRequest): Promise<number> {

        try {
            const {
                employee: { hourlyWage },
                totalToWorkedInSeconds,
                totalWorkedInSeconds,
                totalDayOffs,
                totalWorkingDays,
                absenceDays,
                workedOnMandatoryHolidays,
            } = await this.makeTimeTrackEmployeeMonthlyUseCase.execute({ employeeId, endDate, startDate });

            const { workedHours, workedToHours } = this.convertToHours(totalWorkedInSeconds, totalToWorkedInSeconds!);

            const hoursWorkedPerDay = (workedToHours / (totalDayOffs! + totalWorkingDays + workedOnMandatoryHolidays!));

            const mandatoryHoliday = workedOnMandatoryHolidays! * (hoursWorkedPerDay * 2);

            const lateAbsence = absenceDays! * hoursWorkedPerDay;

            const salaryWithoutAdditional = (workedToHours - lateAbsence + mandatoryHoliday) * hourlyWage;

            const balanceOfWorkSchedule = workedHours - workedToHours;

            const extraHour = this.calculateExtra(balanceOfWorkSchedule, hourlyWage);

            const lateHour = this.calculateLate(balanceOfWorkSchedule, hourlyWage);

            const dayOffExtraHours = this.calculateDayOff(totalWorkingDays!, totalDayOffs!, workedOnMandatoryHolidays!);

            const totalSalary = (extraHour - lateHour) + salaryWithoutAdditional + dayOffExtraHours;

            return Math.round(totalSalary * 100) / 100;

        } catch (err: any) {
            throw new SummariseEmployeeSalaryException(err);
        }
    }

    private convertToHours(totalWorkedInSeconds: number, totalToWorkedInSeconds: number) {
        return {
            workedToHours: totalToWorkedInSeconds / 3600,
            workedHours: totalWorkedInSeconds / 3600
        };
    }

    private calculateExtra(balanceOfWorkSchedule: number, hourlyWage: number): number {
        if (balanceOfWorkSchedule > 0) {

            if (balanceOfWorkSchedule <= this.toleranceMinutes) {
                this.extraHours = 0;
            }

            this.extraHours = hourlyWage * balanceOfWorkSchedule * 1.5;

        }

        return this.extraHours;

    }

    private calculateLate(balanceOfWorkSchedule: number, hourlyWage: number): number {
        if (balanceOfWorkSchedule < 0) {

            if (balanceOfWorkSchedule <= this.toleranceMinutes) {
                this.lateHours = 0;
            }
            this.lateHours = hourlyWage * Math.abs(balanceOfWorkSchedule);

        }
        return this.lateHours;

    }

    private calculateDayOff(totalWorkingDays: number, totalDayOffs: number, workedOnMandatoryHolidays: number) {
        const daysOffValue = (this.extraHours / (totalWorkingDays + workedOnMandatoryHolidays)) * totalDayOffs;

        return daysOffValue;
    }
}
