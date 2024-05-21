import { findByEmployeeAndTimeWindowRequest } from "@/domain/interfaces/work-period-register";
import { InMemoryAbsenceRepository } from "@/infra/database/in-memory-repository/in-memory-absence-repository";
import { InMemoryEmployeeRepository } from "@/infra/database/in-memory-repository/in-memory-employee-repository";
import { InMemoryWorkPeriodRegisterRepository } from "@/infra/database/in-memory-repository/in-memory-work-period-register-repository";
import { InMemoryWorkPeriodRepository } from "@/infra/database/in-memory-repository/in-memory-work-period-repository";
import { PRISMA_NOT_FOUND_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { makeFakeEmployee } from "test/factories/employee-factory";
import { makeFakeWorkPeriod } from "test/factories/work-period-factory";
import { makeFakeWorkPeriodRegister } from "test/factories/work-period-register-factory";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FindManyAbsenceByEmployeeIdUseCase } from "../absence/find-many-absence-by-employee-id";
import { GetDaysOffAndDaysWorkedUseCase } from "../days-off-and-days-worked/get-days-off-and-days-worked";
import { EmployeeNotFoundException } from "../employee/errors/not-found-employee-exception";
import { FindEmployeeByIdUseCase } from "../employee/find-employee-by-id-use-case";
import { GetHoursWorkedUseCase } from "../get-worked/get-hours-worked-use-case";
import { SummariseEmployeeSalaryHourly } from "../summarise-employee-salary-hourly/make-summarise-employee-salary-hourly";
import { SummariseEmployeeSalaryMonthly } from "../summarise-employee-salary-monthly/make-summarise-employee-salary-monthly";
import { MakeTimeTrackEmployeeHourlyUseCase } from "../time-track-employee-hourly/make-time-track-employee-hourly-use-case";
import { MakeTimeTrackEmployeeMonthlyUseCase } from "../time-track-employee-monthly/make-time-track-employee-monthly-use-case";
import { FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase } from "../work-period-register/find-workperiod-register-by-employee-id-window";
import { FindWorkPeriodByCodWorkPeriodUseCase } from "../work-period/find-workperiod-by-code-work-period";
import { DetermineEmployeePaySummary } from "./determine-employee-pay-summary-use-case";
import { DetermineEmployeePaySummaryException } from "./errors/determine-employee-pay-summary-exception";

describe("DetermineEmployeePaySummary", () => {
    let workPeriodRegisterRepository: InMemoryWorkPeriodRegisterRepository;
    let findWorkPeriodRegisterByEmployeeIdWindow: FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase;

    let findEmployeeByIdUseCase: FindEmployeeByIdUseCase;
    let employeeRepository: InMemoryEmployeeRepository;

    const absenceRepository = new InMemoryAbsenceRepository();
    const findAbsenceByEmployeeIdUseCase = new FindManyAbsenceByEmployeeIdUseCase(absenceRepository);

    workPeriodRegisterRepository = new InMemoryWorkPeriodRegisterRepository();
    findWorkPeriodRegisterByEmployeeIdWindow = new FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase(workPeriodRegisterRepository);

    let findWorkPeriodByCodWorkPeriodUseCase: FindWorkPeriodByCodWorkPeriodUseCase;
    let workPeriodRepository: InMemoryWorkPeriodRepository;

    let getHoursWorkedUseCase: GetHoursWorkedUseCase;
    let getDaysOffAndDaysWorkedUseCase: GetDaysOffAndDaysWorkedUseCase;

    let makeTimeTrackEmployeeHourlyUseCase: MakeTimeTrackEmployeeHourlyUseCase;
    let makeTimeTrackEmployeeMonthlyUseCase: MakeTimeTrackEmployeeMonthlyUseCase;

    let summaryEmployeeSalaryHourly: SummariseEmployeeSalaryHourly;
    let summaryEmployeeSalaryMonthly: SummariseEmployeeSalaryMonthly;

    let determineEmployeePaySummary: DetermineEmployeePaySummary;

    beforeEach(() => {
        workPeriodRegisterRepository = new InMemoryWorkPeriodRegisterRepository();
        findWorkPeriodRegisterByEmployeeIdWindow = new FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase(workPeriodRegisterRepository);

        employeeRepository = new InMemoryEmployeeRepository();
        findEmployeeByIdUseCase = new FindEmployeeByIdUseCase(employeeRepository);

        workPeriodRepository = new InMemoryWorkPeriodRepository();
        findWorkPeriodByCodWorkPeriodUseCase = new FindWorkPeriodByCodWorkPeriodUseCase(workPeriodRepository);

        getHoursWorkedUseCase = new GetHoursWorkedUseCase();
        getDaysOffAndDaysWorkedUseCase = new GetDaysOffAndDaysWorkedUseCase();
        makeTimeTrackEmployeeHourlyUseCase = new MakeTimeTrackEmployeeHourlyUseCase(
            findEmployeeByIdUseCase,
            findWorkPeriodRegisterByEmployeeIdWindow,
            getHoursWorkedUseCase,
            getDaysOffAndDaysWorkedUseCase
        );

        makeTimeTrackEmployeeMonthlyUseCase = new MakeTimeTrackEmployeeMonthlyUseCase(
            findEmployeeByIdUseCase,
            findWorkPeriodRegisterByEmployeeIdWindow,
            findWorkPeriodByCodWorkPeriodUseCase,
            findAbsenceByEmployeeIdUseCase,
            getHoursWorkedUseCase,
            getDaysOffAndDaysWorkedUseCase
        );

        summaryEmployeeSalaryHourly = new SummariseEmployeeSalaryHourly(makeTimeTrackEmployeeHourlyUseCase);
        summaryEmployeeSalaryMonthly = new SummariseEmployeeSalaryMonthly(makeTimeTrackEmployeeMonthlyUseCase);

        determineEmployeePaySummary = new DetermineEmployeePaySummary(summaryEmployeeSalaryHourly, summaryEmployeeSalaryMonthly, findEmployeeByIdUseCase);
    });

    it("should be able determine monthly employee pay summarise", async () => {
        const employee = makeFakeEmployee({ id: "employeeId-01", hourlyWage: 5, nisPis: "88888", codWorkPeriod: "COD-01" });

        employeeRepository.create(employee);

        vi.spyOn(summaryEmployeeSalaryMonthly, "execute");
        vi.spyOn(summaryEmployeeSalaryHourly, "execute");

        const fakeWorkPeriod = makeFakeWorkPeriod({
            id: "workPeriodId-01",
            codWorkPeriod: "COD-01",
            createdAt: new Date("2024-03-01T08:00:00.000Z")
        }, 31);

        await workPeriodRepository.create(fakeWorkPeriod);

        for (let i = 1; i <= 31; i++) {
            const day = i.toString().padStart(2, "0");
            const workPeriodRegister = makeFakeWorkPeriodRegister({
                employeeId: "employeeId-01",
                startWorkHour: new Date(`2024-03-${day}T08:00:00.000Z`),
                startBreakHour: new Date(`2024-03-${day}T12:00:00.000Z`),
                finishedBreakHour: new Date(`2024-03-${day}T14:00:00.000Z`),
                finishedWorkHour: new Date(`2024-03-${day}T18:00:00.000Z`),
                createdAt: new Date(`2024-03-${day}T08:00:00.000Z`)
            });

            await workPeriodRegisterRepository.create(workPeriodRegister);
        }

        const input: findByEmployeeAndTimeWindowRequest = {
            employeeId: "employeeId-01",
            startDate: new Date("2024-03-01T08:00:00.000Z"),
            endDate: new Date("2024-03-31T08:00:00.000Z")
        };

        const output = await determineEmployeePaySummary.execute(input);

        expect(summaryEmployeeSalaryMonthly.execute).toHaveBeenCalled();
        expect(summaryEmployeeSalaryHourly.execute).toHaveBeenCalledTimes(0);
        expect(output).toEqual(expect.any(Number));
    });

    it("should be able determine hourly employee pay summarise", async () => {
        const employee = makeFakeEmployee({ id: "employeeId-01", hourlyWage: 5, nisPis: null });

        employeeRepository.create(employee);

        vi.spyOn(summaryEmployeeSalaryMonthly, "execute");
        vi.spyOn(summaryEmployeeSalaryHourly, "execute");

        for (let i = 1; i <= 31; i++) {
            const day = i.toString().padStart(2, "0");
            const workPeriodRegister = makeFakeWorkPeriodRegister({
                employeeId: "employeeId-01",
                startWorkHour: new Date(`2024-03-${day}T08:00:00.000Z`),
                startBreakHour: new Date(`2024-03-${day}T12:00:00.000Z`),
                finishedBreakHour: new Date(`2024-03-${day}T14:00:00.000Z`),
                finishedWorkHour: new Date(`2024-03-${day}T18:00:00.000Z`),
                createdAt: new Date(`2024-03-${day}T08:00:00.000Z`)
            });

            await workPeriodRegisterRepository.create(workPeriodRegister);
        }

        const input: findByEmployeeAndTimeWindowRequest = {
            employeeId: "employeeId-01",
            startDate: new Date("2024-03-01T08:00:00.000Z"),
            endDate: new Date("2024-03-31T08:00:00.000Z")
        };

        const output = await determineEmployeePaySummary.execute(input);

        expect(summaryEmployeeSalaryMonthly.execute).toHaveBeenCalledTimes(0);
        expect(summaryEmployeeSalaryHourly.execute).toHaveBeenCalled();
        expect(output).toEqual(expect.any(Number));
    });

    it("cannot determine employee pay summarise with generic error", async () => {
        vi.spyOn(determineEmployeePaySummary, "execute").mockRejectedValue(new DetermineEmployeePaySummaryException());

        const input: findByEmployeeAndTimeWindowRequest = {
            employeeId: "employeeId-01",
            startDate: new Date("2024-03-01T08:00:00.000Z"),
            endDate: new Date("2024-03-31T08:00:00.000Z")
        };

        await expect(determineEmployeePaySummary.execute(input)).rejects.toThrow(DetermineEmployeePaySummaryException);
    });

    it("cannot determine employee pay summarise with employee not found error", async () => {

        const input: findByEmployeeAndTimeWindowRequest = {
            employeeId: "employeeId-01",
            startDate: new Date("2024-03-01T08:00:00.000Z"),
            endDate: new Date("2024-03-31T08:00:00.000Z")
        };

        vi.spyOn(employeeRepository, "findById").mockRejectedValue({ code: PRISMA_NOT_FOUND_EXCEPTION });

        await expect(determineEmployeePaySummary.execute(input)).rejects.toThrow(EmployeeNotFoundException);
    });
});
