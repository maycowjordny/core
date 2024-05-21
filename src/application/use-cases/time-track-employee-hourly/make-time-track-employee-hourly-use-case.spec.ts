import { findByEmployeeAndTimeWindowRequest } from "@/domain/interfaces/work-period-register";
import { InMemoryEmployeeRepository } from "@/infra/database/in-memory-repository/in-memory-employee-repository";
import { InMemoryWorkPeriodRegisterRepository } from "@/infra/database/in-memory-repository/in-memory-work-period-register-repository";
import { makeFakeEmployee } from "test/factories/employee-factory";
import { makeFakeWorkPeriodRegister } from "test/factories/work-period-register-factory";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeTimeTrackException } from "../../errors/make-time-track-exception";
import { GetDaysOffAndDaysWorkedUseCase } from "../days-off-and-days-worked/get-days-off-and-days-worked";
import { EmployeeNotFoundException } from "../employee/errors/not-found-employee-exception";
import { FindEmployeeByIdUseCase } from "../employee/find-employee-by-id-use-case";
import { GetHoursWorkedUseCase } from "../get-worked/get-hours-worked-use-case";
import { FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase } from "../work-period-register/find-workperiod-register-by-employee-id-window";
import { MakeTimeTrackEmployeeHourlyUseCase } from "./make-time-track-employee-hourly-use-case";

describe("makeTimeEmployeeHourlyUseCase", () => {
    let workPeriodRegisterRepository: InMemoryWorkPeriodRegisterRepository;
    let findWorkPeriodRegisterByEmployeeIdWindow: FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase;

    let findEmployeeByIdUseCase: FindEmployeeByIdUseCase;
    let employeeRepository: InMemoryEmployeeRepository;

    let getHoursWorkedUseCase: GetHoursWorkedUseCase;
    let makeTimeTrackEmployeeHourlyUseCase: MakeTimeTrackEmployeeHourlyUseCase;
    let getDaysOffAndDaysWorkedUseCase: GetDaysOffAndDaysWorkedUseCase;

    beforeEach(() => {
        workPeriodRegisterRepository = new InMemoryWorkPeriodRegisterRepository();
        findWorkPeriodRegisterByEmployeeIdWindow = new FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase(workPeriodRegisterRepository);

        employeeRepository = new InMemoryEmployeeRepository();
        findEmployeeByIdUseCase = new FindEmployeeByIdUseCase(employeeRepository);

        getHoursWorkedUseCase = new GetHoursWorkedUseCase();
        getDaysOffAndDaysWorkedUseCase = new GetDaysOffAndDaysWorkedUseCase();
        makeTimeTrackEmployeeHourlyUseCase = new MakeTimeTrackEmployeeHourlyUseCase(
            findEmployeeByIdUseCase,
            findWorkPeriodRegisterByEmployeeIdWindow,
            getHoursWorkedUseCase,
            getDaysOffAndDaysWorkedUseCase
        );

        vi.spyOn(getHoursWorkedUseCase, "execute");
        vi.spyOn(findWorkPeriodRegisterByEmployeeIdWindow, "execute");
    });

    it("should be able to make time track employee hourly", async () => {

        const employeeCreate = makeFakeEmployee({
            id: "employeeId-01",
            hourlyWage: 5,
        });

        await employeeRepository.create(employeeCreate);

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

        const output = await makeTimeTrackEmployeeHourlyUseCase.execute(input);

        expect(getHoursWorkedUseCase.execute).toHaveBeenCalled();
        expect(findWorkPeriodRegisterByEmployeeIdWindow.execute).toHaveBeenCalled();
        expect(output).toMatchObject({
            employee: {
                id: output.employee.id!,
                hourlyWage: output.employee.hourlyWage,
            },
            totalDayOffs: output.totalDayOffs,
            totalWorkingDays: output.totalWorkingDays,
            totalWorkedInSeconds: output.totalWorkedInSeconds,
        });
    });

    it("should be able to make time track when employee misses days of work", async () => {

        const employeeCreate = makeFakeEmployee({
            id: "employeeId-01",
            hourlyWage: 5,
        });

        employeeRepository.create(employeeCreate);

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

        const output = await makeTimeTrackEmployeeHourlyUseCase.execute(input);

        expect(getHoursWorkedUseCase.execute).toHaveBeenCalled();
        expect(findWorkPeriodRegisterByEmployeeIdWindow.execute).toHaveBeenCalled();
        expect(output).toMatchObject({
            employee: {
                id: output.employee.id!,
                hourlyWage: output.employee.hourlyWage,
            },
            totalDayOffs: output.totalDayOffs,
            totalWorkingDays: output.totalWorkingDays,
            totalWorkedInSeconds: output.totalWorkedInSeconds,
        });
    });

    it("cannot create make time track employee hourly when generic error", async () => {
        vi.spyOn(makeTimeTrackEmployeeHourlyUseCase, "execute").mockRejectedValue(new makeTimeTrackException());

        const input: findByEmployeeAndTimeWindowRequest = {
            employeeId: "employeeId-01",
            startDate: new Date("2024-01-01T08:00:00.000Z"),
            endDate: new Date("2024-01-30T08:00:00.000Z")
        };

        await expect(makeTimeTrackEmployeeHourlyUseCase.execute(input)).rejects.toThrow(makeTimeTrackException);
    });

    it("cannot create make time track employee hourly when employee not found error", async () => {
        vi.spyOn(makeTimeTrackEmployeeHourlyUseCase, "execute").mockRejectedValue(new EmployeeNotFoundException());

        const input: findByEmployeeAndTimeWindowRequest = {
            employeeId: "employeeId-01",
            startDate: new Date("2024-01-01T08:00:00.000Z"),
            endDate: new Date("2024-01-30T08:00:00.000Z")
        };

        await expect(makeTimeTrackEmployeeHourlyUseCase.execute(input)).rejects.toThrow(EmployeeNotFoundException);
    });
});
