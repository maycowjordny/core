import { findByEmployeeAndTimeWindowRequest } from "@/domain/interfaces/work-period-register";
import { SummariseEmployeeSalaryException } from "../../errors/summarise-employee-salary-exception";
import { MakeTimeTrackEmployeeHourlyUseCase } from "../time-track-employee-hourly/make-time-track-employee-hourly-use-case";

export class SummariseEmployeeSalaryHourly {
    constructor(private makeTimeTrackEmployeeHourlyUseCase: MakeTimeTrackEmployeeHourlyUseCase) { }

    async execute({ employeeId, endDate, startDate }: findByEmployeeAndTimeWindowRequest): Promise<number> {

        try {
            const {
                employee: { hourlyWage },
                totalWorkedInSeconds,
                totalDayOffs,
                totalWorkingDays
            } = await this.makeTimeTrackEmployeeHourlyUseCase.execute({ employeeId, endDate, startDate });

            const { workedHours } = this.convertToHours(totalWorkedInSeconds);

            const salaryWithoutAdditional = workedHours * hourlyWage;

            const dsr = this.calculateDsr(salaryWithoutAdditional, totalWorkingDays, totalDayOffs);

            const salary = salaryWithoutAdditional + dsr;

            return Math.round(salary * 100) / 100;

        } catch (err: any) {
            throw new SummariseEmployeeSalaryException(err);
        }
    }

    private calculateDsr(salaryWithoutAdditional: number, totalWorkingDays: number, totalDayOffsEmployeeMonthly: number) {
        return (salaryWithoutAdditional / totalWorkingDays) * totalDayOffsEmployeeMonthly;
    }

    private convertToHours(totalWorkedInSeconds: number) {
        return {
            workedHours: totalWorkedInSeconds / 3600
        };
    }
}
