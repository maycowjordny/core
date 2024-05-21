import { makeTimeTrackException } from "@/application/errors/make-time-track-exception";
import { TypeAbsenceEnum } from "@/domain/enum/absence-enum";
import { WeekdayEnum } from "@/domain/enum/week-day-enum";
import { findByEmployeeAndTimeWindowRequest } from "@/domain/interfaces/work-period-register";
import { InMemoryAbsenceRepository } from "@/infra/database/in-memory-repository/in-memory-absence-repository";
import { InMemoryEmployeeRepository } from "@/infra/database/in-memory-repository/in-memory-employee-repository";
import { InMemoryWorkPeriodRegisterRepository } from "@/infra/database/in-memory-repository/in-memory-work-period-register-repository";
import { InMemoryWorkPeriodRepository } from "@/infra/database/in-memory-repository/in-memory-work-period-repository";
import { makeFakeAbsence } from "test/factories/absence-factory";
import { makeFakeEmployee } from "test/factories/employee-factory";
import { makeFakeWorkPeriod } from "test/factories/work-period-factory";
import { makeFakeWorkPeriodRegister } from "test/factories/work-period-register-factory";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FindManyAbsenceByEmployeeIdUseCase } from "../absence/find-many-absence-by-employee-id";
import { GetDaysOffAndDaysWorkedUseCase } from "../days-off-and-days-worked/get-days-off-and-days-worked";
import { EmployeeNotFoundException } from "../employee/errors/not-found-employee-exception";
import { FindEmployeeByIdUseCase } from "../employee/find-employee-by-id-use-case";
import { GetHoursWorkedUseCase } from "../get-worked/get-hours-worked-use-case";
import { FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase } from "../work-period-register/find-workperiod-register-by-employee-id-window";
import { FindWorkPeriodByCodWorkPeriodUseCase } from "../work-period/find-workperiod-by-code-work-period";
import { MakeTimeTrackEmployeeMonthlyUseCase } from "./make-time-track-employee-monthly-use-case";

describe("makeTimeEmployeeMonthlyUseCase", () => {

    let workPeriodRegisterRepository: InMemoryWorkPeriodRegisterRepository;
    let findWorkPeriodRegisterByEmployeeIdWindow: FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase;

    let findWorkPeriodByCodWorkPeriodUseCase: FindWorkPeriodByCodWorkPeriodUseCase;
    let workPeriodRepository: InMemoryWorkPeriodRepository;

    let findEmployeeByIdUseCase: FindEmployeeByIdUseCase;
    let employeeRepository: InMemoryEmployeeRepository;

    let findAbsenceByEmployeeIdUseCase: FindManyAbsenceByEmployeeIdUseCase;
    let absenceRepository: InMemoryAbsenceRepository;

    let getHoursWorkedUseCase: GetHoursWorkedUseCase;
    let makeTimeTrackEmployeeMonthlyUseCase: MakeTimeTrackEmployeeMonthlyUseCase;
    let getDaysOffAndDaysWorkedUseCase: GetDaysOffAndDaysWorkedUseCase;

    beforeEach(() => {
        employeeRepository = new InMemoryEmployeeRepository();
        findEmployeeByIdUseCase = new FindEmployeeByIdUseCase(employeeRepository);

        workPeriodRepository = new InMemoryWorkPeriodRepository();
        findWorkPeriodByCodWorkPeriodUseCase = new FindWorkPeriodByCodWorkPeriodUseCase(workPeriodRepository);

        workPeriodRegisterRepository = new InMemoryWorkPeriodRegisterRepository();
        findWorkPeriodRegisterByEmployeeIdWindow = new FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase(workPeriodRegisterRepository);

        absenceRepository = new InMemoryAbsenceRepository();
        findAbsenceByEmployeeIdUseCase = new FindManyAbsenceByEmployeeIdUseCase(absenceRepository);

        getHoursWorkedUseCase = new GetHoursWorkedUseCase();
        getDaysOffAndDaysWorkedUseCase = new GetDaysOffAndDaysWorkedUseCase();
        makeTimeTrackEmployeeMonthlyUseCase = new MakeTimeTrackEmployeeMonthlyUseCase(
            findEmployeeByIdUseCase,
            findWorkPeriodRegisterByEmployeeIdWindow,
            findWorkPeriodByCodWorkPeriodUseCase,
            findAbsenceByEmployeeIdUseCase,
            getHoursWorkedUseCase,
            getDaysOffAndDaysWorkedUseCase
        );

        vi.spyOn(getHoursWorkedUseCase, "execute");
        vi.spyOn(findWorkPeriodByCodWorkPeriodUseCase, "execute");
        vi.spyOn(findWorkPeriodRegisterByEmployeeIdWindow, "execute");
        vi.spyOn(findAbsenceByEmployeeIdUseCase, "execute");
        vi.spyOn(findAbsenceByEmployeeIdUseCase, "execute");
    });

    it("should be able to make time track employee monthly", async () => {

        const employeeCreate = makeFakeEmployee({
            id: "employeeId-01",
            hourlyWage: 5,
            codWorkPeriod: "COD-01"
        });

        employeeRepository.create(employeeCreate);

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

        const output = await makeTimeTrackEmployeeMonthlyUseCase.execute(input);

        expect(getHoursWorkedUseCase.execute).toHaveBeenCalled();
        expect(findWorkPeriodByCodWorkPeriodUseCase.execute).toHaveBeenCalled();
        expect(findWorkPeriodRegisterByEmployeeIdWindow.execute).toHaveBeenCalled();
        expect(findAbsenceByEmployeeIdUseCase.execute).toHaveBeenCalled();
        expect(output).toMatchObject({
            employee: {
                id: output.employee.id,
                hourlyWage: output.employee.hourlyWage
            },
            absenceDays: output.absenceDays,
            totalDayOffs: output.totalDayOffs,
            totalWorkingDays: output.totalWorkingDays,
            workedOnMandatoryHolidays: output.workedOnMandatoryHolidays,
            totalWorkedInSeconds: output.totalWorkedInSeconds,
            totalToWorkedInSeconds: output.totalToWorkedInSeconds,
        });
    });

    it("should be able to make time track employee monthly when employee misses days of work", async () => {

        const employeeCreate = makeFakeEmployee({
            id: "employeeId-01",
            hourlyWage: 5,
            codWorkPeriod: "COD-01"
        });

        employeeRepository.create(employeeCreate);

        const absenceCreate = makeFakeAbsence({
            employeeId: "employeeId-01",
            type: TypeAbsenceEnum.UNJUSTIFIED,
            initialDate: new Date("2024-01-30T08:00:00.000Z"),
            endDate: new Date("2024-01-31T08:00:00.000Z")
        });

        absenceRepository.create(absenceCreate);

        const fakeWorkPeriod = makeFakeWorkPeriod({
            id: "workPeriodId-01",
            codWorkPeriod: "COD-01",
            workPeriods: [{
                day: WeekdayEnum.Friday,
                name: "Test",
                startWorkHour: new Date("2024-01-01T08:00:00.000Z"),
                startBreakHour: new Date("2024-01-01T12:00:00.000Z"),
                finishedBreakHour: new Date("2024-01-01T14:00:00.000Z"),
                finishedWorkHour: new Date("2024-01-01T18:00:00.000Z"),
            }],
            createdAt: new Date("2024-01-01T08:00:00.000Z")
        }, 31);

        workPeriodRepository.create(fakeWorkPeriod);

        for (let i = 1; i <= 30; i++) {
            const day = i.toString().padStart(2, "0");
            const workPeriodRegister = makeFakeWorkPeriodRegister({
                employeeId: "employeeId-01",
                startWorkHour: new Date(`2024-01-${day}T08:00:00.000Z`),
                startBreakHour: new Date(`2024-01-${day}T12:00:00.000Z`),
                finishedBreakHour: new Date(`2024-01-${day}T14:00:00.000Z`),
                finishedWorkHour: new Date(`2024-01-${day}T18:00:00.000Z`),
                createdAt: new Date(`2024-01-${day}T08:00:00.000Z`)
            });
            await workPeriodRegisterRepository.create(workPeriodRegister);
        }

        const input: findByEmployeeAndTimeWindowRequest = {
            employeeId: "employeeId-01",
            startDate: new Date("2024-01-01T08:00:00.000Z"),
            endDate: new Date("2024-01-31T08:00:00.000Z")
        };

        const output = await makeTimeTrackEmployeeMonthlyUseCase.execute(input);

        expect(getHoursWorkedUseCase.execute).toHaveBeenCalled();
        expect(findWorkPeriodByCodWorkPeriodUseCase.execute).toHaveBeenCalled();
        expect(findWorkPeriodRegisterByEmployeeIdWindow.execute).toHaveBeenCalled();
        expect(output).toMatchObject({
            employee: {
                id: output.employee.id,
                hourlyWage: output.employee.hourlyWage
            },
            absenceDays: output.absenceDays,
            totalDayOffs: output.totalDayOffs,
            totalWorkingDays: output.totalWorkingDays,
            workedOnMandatoryHolidays: output.workedOnMandatoryHolidays,
            totalWorkedInSeconds: output.totalWorkedInSeconds,
            totalToWorkedInSeconds: output.totalToWorkedInSeconds,
        });
    });

    it("cannot create make time track employee monthly when generic error", async () => {
        vi.spyOn(makeTimeTrackEmployeeMonthlyUseCase, "execute").mockRejectedValue(new makeTimeTrackException());

        const input: findByEmployeeAndTimeWindowRequest = {
            employeeId: "employeeId-01",
            startDate: new Date("2024-01-01T08:00:00.000Z"),
            endDate: new Date("2024-01-30T08:00:00.000Z")
        };

        await expect(makeTimeTrackEmployeeMonthlyUseCase.execute(input)).rejects.toThrow(makeTimeTrackException);
    });

    it("cannot create make time track employee monthly when employee not found error", async () => {
        vi.spyOn(makeTimeTrackEmployeeMonthlyUseCase, "execute").mockRejectedValue(new EmployeeNotFoundException());

        const input: findByEmployeeAndTimeWindowRequest = {
            employeeId: "employeeId-01",
            startDate: new Date("2024-01-01T08:00:00.000Z"),
            endDate: new Date("2024-01-30T08:00:00.000Z")
        };

        await expect(makeTimeTrackEmployeeMonthlyUseCase.execute(input)).rejects.toThrow(EmployeeNotFoundException);
    });
});
