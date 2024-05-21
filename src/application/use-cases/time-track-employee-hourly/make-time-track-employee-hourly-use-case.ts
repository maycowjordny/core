import { makeTimeTrackException } from "@/application/errors/make-time-track-exception";
import { WorkPeriodRegister } from "@/domain/entities/work-period-register-entity";
import { CalculateWorkPeriodRegisterResponse, findByEmployeeAndTimeWindowRequest } from "@/domain/interfaces/work-period-register";
import { GetDaysOffAndDaysWorkedUseCase } from "../days-off-and-days-worked/get-days-off-and-days-worked";
import { EmployeeNotFoundException } from "../employee/errors/not-found-employee-exception";
import { FindEmployeeByIdUseCase } from "../employee/find-employee-by-id-use-case";
import { GetHoursWorkedUseCase } from "../get-worked/get-hours-worked-use-case";
import { FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase } from "../work-period-register/find-workperiod-register-by-employee-id-window";

export class MakeTimeTrackEmployeeHourlyUseCase {
    constructor(
        private findEmployeeByIdUseCase: FindEmployeeByIdUseCase,
        private findWorkPeriodRegisterByEmployeeIdWindow: FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase,
        private getWorkedHoursUseCase: GetHoursWorkedUseCase,
        private getDaysOffAndDaysWorkedUseCase: GetDaysOffAndDaysWorkedUseCase,
    ) { }

    private totalWorkedSecconds: number = 0;

    async execute({ employeeId, endDate, startDate }: findByEmployeeAndTimeWindowRequest): Promise<CalculateWorkPeriodRegisterResponse> {
        try {
            const workPeriodRegisters = await this.findWorkPeriodRegisterByEmployeeIdWindow.execute({ employeeId, endDate, startDate });

            const employee = await this.findEmployeeByIdUseCase.execute(employeeId);

            if (!employee) throw new EmployeeNotFoundException();

            const { totalDayOffs, totalWorkingDays } = await this.getDaysOffAndDaysWorkedUseCase.execute(workPeriodRegisters);

            return {
                employee: {
                    id: employee.id!,
                    hourlyWage: employee.hourlyWage,
                },
                totalDayOffs: totalDayOffs.length,
                totalWorkingDays: totalWorkingDays.length,
                totalWorkedInSeconds: this.getTotalWorkedInSeconds(workPeriodRegisters),
            };
        } catch (err: any) {
            throw new makeTimeTrackException(err);
        }
    }

    private getTotalWorkedInSeconds(workPeriodRegisters: WorkPeriodRegister[]) {
        workPeriodRegisters.map(workPeriodRegister => {
            this.totalWorkedSecconds += this.getWorkedHoursUseCase.execute(workPeriodRegister);
        });

        return this.totalWorkedSecconds;
    }

}
