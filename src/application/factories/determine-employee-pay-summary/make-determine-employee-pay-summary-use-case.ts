import { FindManyAbsenceByEmployeeIdUseCase } from "@/application/use-cases/absence/find-many-absence-by-employee-id";
import { GetDaysOffAndDaysWorkedUseCase } from "@/application/use-cases/days-off-and-days-worked/get-days-off-and-days-worked";
import { DetermineEmployeePaySummary } from "@/application/use-cases/determine-employee-pay-summary /determine-employee-pay-summary-use-case";
import { FindEmployeeByIdUseCase } from "@/application/use-cases/employee/find-employee-by-id-use-case";
import { GetHoursWorkedUseCase } from "@/application/use-cases/get-worked/get-hours-worked-use-case";
import { SummariseEmployeeSalaryHourly } from "@/application/use-cases/summarise-employee-salary-hourly/make-summarise-employee-salary-hourly";
import { SummariseEmployeeSalaryMonthly } from "@/application/use-cases/summarise-employee-salary-monthly/make-summarise-employee-salary-monthly";
import { MakeTimeTrackEmployeeHourlyUseCase } from "@/application/use-cases/time-track-employee-hourly/make-time-track-employee-hourly-use-case";
import { MakeTimeTrackEmployeeMonthlyUseCase } from "@/application/use-cases/time-track-employee-monthly/make-time-track-employee-monthly-use-case";
import { FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase } from "@/application/use-cases/work-period-register/find-workperiod-register-by-employee-id-window";
import { FindWorkPeriodByCodWorkPeriodUseCase } from "@/application/use-cases/work-period/find-workperiod-by-code-work-period";
import { PrismaAbsenceRepository } from "@/infra/database/prisma/repositories/prisma-absence-repository";
import { PrismaEmployeeRepository } from "@/infra/database/prisma/repositories/prisma-employee-repository";
import { PrismaWorkPeriodRegisterRepository } from "@/infra/database/prisma/repositories/prisma-work-period-register-repository";
import { PrismaWorkPeriodRepository } from "@/infra/database/prisma/repositories/prisma-work-period-repository";

const workPeriodRepository = new PrismaWorkPeriodRepository();
const findWorkPeriodByCodWorkPeriodUseCase = new FindWorkPeriodByCodWorkPeriodUseCase(workPeriodRepository);

const workPeriodRegisterRepository = new PrismaWorkPeriodRegisterRepository();
const findWorkPeriodRegisterByEmployeeIdWindow = new FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase(workPeriodRegisterRepository);

const absenceRepository = new PrismaAbsenceRepository();
const findAbsenceByEmployeeIdUseCase = new FindManyAbsenceByEmployeeIdUseCase(absenceRepository);

const employeeRepository = new PrismaEmployeeRepository();
const findEmployeeByIdUseCase = new FindEmployeeByIdUseCase(employeeRepository);

const getHoursWorkedUseCase = new GetHoursWorkedUseCase();
const getDaysOffAndDaysWorkedUseCase = new GetDaysOffAndDaysWorkedUseCase();

const makeTimeTrackEmployeeHourlyUseCase = new MakeTimeTrackEmployeeHourlyUseCase(
    findEmployeeByIdUseCase,
    findWorkPeriodRegisterByEmployeeIdWindow,
    getHoursWorkedUseCase,
    getDaysOffAndDaysWorkedUseCase
);

const makeTimeTrackEmployeeMonthlyUseCase = new MakeTimeTrackEmployeeMonthlyUseCase(
    findEmployeeByIdUseCase,
    findWorkPeriodRegisterByEmployeeIdWindow,
    findWorkPeriodByCodWorkPeriodUseCase,
    findAbsenceByEmployeeIdUseCase,
    getHoursWorkedUseCase,
    getDaysOffAndDaysWorkedUseCase
);

const summariseEmployeeHourlyUseCase = new SummariseEmployeeSalaryHourly(makeTimeTrackEmployeeHourlyUseCase);
const summariseEmployeeMonthlyUseCase = new SummariseEmployeeSalaryMonthly(makeTimeTrackEmployeeMonthlyUseCase);

export function makeDetermineEmployeePaySummary() {

    const summariseEmployeeUseCase = new DetermineEmployeePaySummary(
        summariseEmployeeHourlyUseCase,
        summariseEmployeeMonthlyUseCase,
        findEmployeeByIdUseCase
    );

    return summariseEmployeeUseCase;
}
