import { SummariseEmployeeSalaryException } from "@/application/errors/summarise-employee-salary-exception";
import { InMemoryAbsenceRepository } from "@/infra/database/in-memory-repository/in-memory-absence-repository";
import { InMemoryEmployeeRepository } from "@/infra/database/in-memory-repository/in-memory-employee-repository";
import { InMemoryWorkPeriodRegisterRepository } from "@/infra/database/in-memory-repository/in-memory-work-period-register-repository";
import { InMemoryWorkPeriodRepository } from "@/infra/database/in-memory-repository/in-memory-work-period-repository";
import { makeFakeEmployee } from "test/factories/employee-factory";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FindManyAbsenceByEmployeeIdUseCase } from "../absence/find-many-absence-by-employee-id";
import { GetDaysOffAndDaysWorkedUseCase } from "../days-off-and-days-worked/get-days-off-and-days-worked";
import { FindEmployeeByIdUseCase } from "../employee/find-employee-by-id-use-case";
import { GetHoursWorkedUseCase } from "../get-worked/get-hours-worked-use-case";
import { MakeTimeTrackEmployeeMonthlyUseCase } from "../time-track-employee-monthly/make-time-track-employee-monthly-use-case";
import { FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase } from "../work-period-register/find-workperiod-register-by-employee-id-window";
import { FindWorkPeriodByCodWorkPeriodAndDayUseCase } from "../work-period/find-workperiod-by-code-work-period-and-day";
import { SummariseEmployeeSalaryMonthly } from "./make-summarise-employee-salary-monthly";

describe("SummariseEmployeeSalaryMonthly", () => {
    let workPeriodRegisterRepository: InMemoryWorkPeriodRegisterRepository;
    let findWorkPeriodRegisterByEmployeeIdWindow: FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase;

    let findWorkPeriodByEmployeeIdUseCase: FindWorkPeriodByCodWorkPeriodAndDayUseCase;
    let workPeriodRepository: InMemoryWorkPeriodRepository;

    let findEmployeeByIdUseCase: FindEmployeeByIdUseCase;
    let employeeRepository: InMemoryEmployeeRepository;

    let findAbsenceByEmployeeIdUseCase: FindManyAbsenceByEmployeeIdUseCase;
    let absenceRepository: InMemoryAbsenceRepository;

    let getHoursWorkedUseCase: GetHoursWorkedUseCase;
    let makeTimeTrackEmployeeMonthlyUseCase: MakeTimeTrackEmployeeMonthlyUseCase;
    let summaryEmployeeSalary: SummariseEmployeeSalaryMonthly;
    let getDaysOffAndDaysWorkedUseCase: GetDaysOffAndDaysWorkedUseCase;

    beforeEach(() => {
        workPeriodRepository = new InMemoryWorkPeriodRepository();
        findWorkPeriodByEmployeeIdUseCase = new FindWorkPeriodByCodWorkPeriodAndDayUseCase(workPeriodRepository);

        workPeriodRegisterRepository = new InMemoryWorkPeriodRegisterRepository();
        findWorkPeriodRegisterByEmployeeIdWindow = new FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase(workPeriodRegisterRepository);

        employeeRepository = new InMemoryEmployeeRepository();
        findEmployeeByIdUseCase = new FindEmployeeByIdUseCase(employeeRepository);

        absenceRepository = new InMemoryAbsenceRepository();
        findAbsenceByEmployeeIdUseCase = new FindManyAbsenceByEmployeeIdUseCase(absenceRepository);

        getHoursWorkedUseCase = new GetHoursWorkedUseCase();
        getDaysOffAndDaysWorkedUseCase = new GetDaysOffAndDaysWorkedUseCase();
        makeTimeTrackEmployeeMonthlyUseCase = new MakeTimeTrackEmployeeMonthlyUseCase(
            findEmployeeByIdUseCase,
            findWorkPeriodRegisterByEmployeeIdWindow,
            findWorkPeriodByEmployeeIdUseCase,
            findAbsenceByEmployeeIdUseCase,
            getHoursWorkedUseCase,
            getDaysOffAndDaysWorkedUseCase
        );

        summaryEmployeeSalary = new SummariseEmployeeSalaryMonthly(makeTimeTrackEmployeeMonthlyUseCase);
    });

    it("should be able summarise employee salary montly without extra hours", async () => {
        const employee = makeFakeEmployee({ id: "employeeId-01" });

        const worked180HoursInSeconds = 648000;

        vi.spyOn(makeTimeTrackEmployeeMonthlyUseCase, "execute").mockResolvedValue({
            employee: {
                id: employee.id!,
                hourlyWage: 10
            },
            totalWorkedInSeconds: worked180HoursInSeconds,
            totalToWorkedInSeconds: worked180HoursInSeconds,
            totalDayOffs: 4,
            totalWorkingDays: 26,
            absenceDays: 0,
            workedOnMandatoryHolidays: 0
        });

        const output = await summaryEmployeeSalary.execute({ employeeId: employee.id! });

        expect(makeTimeTrackEmployeeMonthlyUseCase.execute).toHaveBeenCalled();
        expect(output).toEqual(1800);
    });

    it("should be able summarise employee salary montly with extra hours", async () => {
        const employee = makeFakeEmployee({ id: "employeeId-01" });

        const worked220HoursInSeconds = 792000;
        const worked228HoursInSeconds = 820800;

        vi.spyOn(makeTimeTrackEmployeeMonthlyUseCase, "execute").mockResolvedValue({
            employee: {
                id: employee.id!,
                hourlyWage: 6.82
            },
            totalWorkedInSeconds: worked228HoursInSeconds,
            totalToWorkedInSeconds: worked220HoursInSeconds,
            totalDayOffs: 6,
            totalWorkingDays: 25,
            absenceDays: 0,
            workedOnMandatoryHolidays: 0
        });

        const output = await summaryEmployeeSalary.execute({ employeeId: employee.id! });

        expect(makeTimeTrackEmployeeMonthlyUseCase.execute).toHaveBeenCalled();
        expect(output).toEqual(1601.88);
    });

    it("should be able summarise employee salary montly with late hours", async () => {
        const employee = makeFakeEmployee({ id: "employeeId-01" });
        const worked220HoursInSeconds = 792000;
        const worked212HoursInSeconds = 763200;

        vi.spyOn(makeTimeTrackEmployeeMonthlyUseCase, "execute").mockResolvedValue({
            employee: {
                id: employee.id!,
                hourlyWage: 6.82,
            },
            totalWorkedInSeconds: worked212HoursInSeconds,
            totalToWorkedInSeconds: worked220HoursInSeconds,
            totalDayOffs: 6,
            totalWorkingDays: 24,
            absenceDays: 0,
            workedOnMandatoryHolidays: 0
        });

        const output = await summaryEmployeeSalary.execute({ employeeId: employee.id! });

        expect(makeTimeTrackEmployeeMonthlyUseCase.execute).toHaveBeenCalled();
        expect(output).toEqual(1445.84);
    });

    it("cannot summarise employee salary montly with generic error", async () => {
        vi.spyOn(summaryEmployeeSalary, "execute").mockRejectedValue(new SummariseEmployeeSalaryException());

        const employee = makeFakeEmployee({ id: "employeeId-01" });

        await expect(summaryEmployeeSalary.execute({ employeeId: employee.id! })).rejects.toThrow(
            SummariseEmployeeSalaryException
        );
    });
});
