import { findByEmployeeAndTimeWindowRequest } from "@/domain/interfaces/work-period-register";
import { PRISMA_NOT_FOUND_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { EmployeeNotFoundException } from "../employee/errors/not-found-employee-exception";
import { FindEmployeeByIdUseCase } from "../employee/find-employee-by-id-use-case";
import { SummariseEmployeeSalaryHourly } from "../summarise-employee-salary-hourly/make-summarise-employee-salary-hourly";
import { SummariseEmployeeSalaryMonthly } from "../summarise-employee-salary-monthly/make-summarise-employee-salary-monthly";
import { DetermineEmployeePaySummaryException } from "./errors/determine-employee-pay-summary-exception";

export class DetermineEmployeePaySummary {
    constructor(
        private summariseEmployeeSalaryHourlyUseCase: SummariseEmployeeSalaryHourly,
        private summariseEmployeeSalaryMonthlyUseCase: SummariseEmployeeSalaryMonthly,
        private findEmployeeByIdUseCase: FindEmployeeByIdUseCase,
    ) { }

    async execute({ employeeId, endDate, startDate }: findByEmployeeAndTimeWindowRequest): Promise<number> {
        try {
            const employee = await this.findEmployeeByIdUseCase.execute(employeeId);

            if (!employee) throw new EmployeeNotFoundException();

            if (employee.nisPis) {
                return await this.summariseEmployeeSalaryMonthlyUseCase.execute({ employeeId, endDate, startDate });
            }

            return await this.summariseEmployeeSalaryHourlyUseCase.execute({ employeeId, endDate, startDate });
        } catch (err: any) {

            if (err.code == PRISMA_NOT_FOUND_EXCEPTION) {
                throw new EmployeeNotFoundException();
            }

            throw new DetermineEmployeePaySummaryException(err);
        }

    }
}
