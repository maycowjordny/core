import { findByEmployeeAndTimeWindowRequest } from "@/domain/interfaces/work-period-register";
import { InMemoryWorkPeriodRegisterRepository } from "@/infra/database/in-memory-repository/in-memory-work-period-register-repository";
import { PRISMA_NOT_FOUND_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { makeFakeWorkPeriodRegister } from "test/factories/work-period-register-factory";
import { workPeriodRegisterRepositoryMock } from "test/mock/work-period-register-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { EmployeeIdNotFoundException } from "../../errors/employee-id-not-found";
import { FindByEmployeeAndTimeWindowException } from "../../errors/find-by-employee-and-time-window-exception";
import { FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase } from "./find-workperiod-register-by-employee-id-window";

describe("FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase", () => {
    let workPeriodRegisterRepository: InMemoryWorkPeriodRegisterRepository;
    let findWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase: FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase;

    beforeEach(() => {
        workPeriodRegisterRepository = new InMemoryWorkPeriodRegisterRepository();
        findWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase = new FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase(
            workPeriodRegisterRepository
        );
    });

    it("should be able to find work period register by employeeId and createdAt", async () => {

        for (let i = 1; i <= 10; i++) {
            const day = i.toString().padStart(2, "0");

            const workPeriodRegister = makeFakeWorkPeriodRegister({
                employeeId: "employeeId-01",
                startWorkHour: new Date(`2024-01-${day}T08:00:00.000Z`),
                startBreakHour: new Date(`2024-01-${day}T12:00:00.000Z`),
                finishedBreakHour: new Date(`2024-01-${day}T14:00:00.000Z`),
                finishedWorkHour: new Date(`2024-01-${day}T18:00:00.000Z`),
                createdAt: new Date(`2024-01-${day}T08:00:00.000Z`)
            });
            workPeriodRegisterRepository.create(workPeriodRegister);
        }

        const result: findByEmployeeAndTimeWindowRequest = {
            employeeId: "employeeId-01",
            startDate: new Date("2024-01-01T00:00:00.000Z"),
            endDate: new Date("2024-01-05T23:59:59.000Z"),
        };

        const output = await findWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase.execute(result);

        expect(output).toHaveLength(5);
        output!.map(out => expect(out.employeeId).toEqual(result.employeeId));
    });

    it("cannot find work period register by employeeId and createdAt with generic error", async () => {
        workPeriodRegisterRepositoryMock.findByEmployeeAndTimeWindow.mockRejectedValue(new Error());

        const findWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase = new FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase(
            workPeriodRegisterRepositoryMock
        );

        const result: findByEmployeeAndTimeWindowRequest = {
            employeeId: "employeeId-01",
            startDate: new Date("2024-01-01T08:00:00.000Z"),
            endDate: new Date("2024-01-05T08:00:00.000Z")
        };

        await expect(findWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase.execute(result)).rejects.toThrow(FindByEmployeeAndTimeWindowException);
    });

    it("cannot find work period register by employeeId and createdAt with employee not found error", async () => {
        workPeriodRegisterRepositoryMock.findByEmployeeAndTimeWindow.mockRejectedValue({
            code: PRISMA_NOT_FOUND_EXCEPTION
        });

        const findWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase = new FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase(
            workPeriodRegisterRepositoryMock
        );

        const result: findByEmployeeAndTimeWindowRequest = {
            employeeId: "employeeId-01",
            startDate: new Date("2024-01-01T08:00:00.000Z"),
            endDate: new Date("2024-01-05T08:00:00.000Z")
        };

        await expect(findWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase.execute(result)).rejects.toThrow(
            EmployeeIdNotFoundException
        );
    });
});
