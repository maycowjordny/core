import { beforeEach, describe, expect, it } from "vitest";
import { findByEmployeeAndTimeWindowRequest } from "@/domain/interfaces/work-period-register";
import { PRISMA_NOT_FOUND_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { FindByEmployeeAndTimeWindowException } from "../../errors/find-by-employee-and-time-window-exception";
import { FindExtraWorkPeriodByEmployeeIdUseCase } from "./find-extra-work-period-by-employee-id-window";
import { InMemoryExtraWorkPeriodRepository } from "@/infra/database/in-memory-repository/in-memory-extra-work-period-repository";
import { makeFakeExtraWorkPeriod } from "test/factories/extra-work-period-factory";
import { extraWorkPeriodRepositoryMock } from "test/mock/extra-work-period-mock";
import { EmployeeIdNotFoundException } from "@/application/errors/employee-id-not-found";
import { ExtraWorkPeriodNotFoundException } from "./errors/extra-work-period-not-found-exception";

describe("FindExtraWorkPeriodByEmployeeIdUseCase", () => {
    let extraWorkPeriodRepository: InMemoryExtraWorkPeriodRepository;
    let findExtraWorkPeriodByEmployeeIdUseCase: FindExtraWorkPeriodByEmployeeIdUseCase;

    beforeEach(() => {
        extraWorkPeriodRepository = new InMemoryExtraWorkPeriodRepository();
        findExtraWorkPeriodByEmployeeIdUseCase = new FindExtraWorkPeriodByEmployeeIdUseCase(
            extraWorkPeriodRepository
        );
    });

    it("should be able to find extra work period by employeeId and createdAt", async () => {

        for (let i = 1; i <= 10; i++) {
            const day = i.toString().padStart(2, "0");

            const extraWorkPeriod = makeFakeExtraWorkPeriod({
                employeeId: "employeeId-01",
                createdAt: new Date(`2024-01-${day}T08:00:00.000Z`)
            });
            extraWorkPeriodRepository.create(extraWorkPeriod);
        }

        const result: findByEmployeeAndTimeWindowRequest = {
            employeeId: "employeeId-01",
            startDate: new Date("2024-01-01T08:00:00.000Z"),
            endDate: new Date("2024-01-05T08:00:00.000Z")
        };

        const output = await findExtraWorkPeriodByEmployeeIdUseCase.execute(result);

        expect(output).toHaveLength(5);
        output!.map(out => expect(out.employeeId).toEqual(result.employeeId));
    });

    it("cannot find extra work period by employeeId and createdAt with extra work period not found error", async () => {
        extraWorkPeriodRepositoryMock.findByEmployeeAndTimeWindow.mockResolvedValue(null);

        const findExtraWorkPeriodByEmployeeIdUseCase = new FindExtraWorkPeriodByEmployeeIdUseCase(
            extraWorkPeriodRepositoryMock
        );

        const result: findByEmployeeAndTimeWindowRequest = {
            employeeId: "employeeId-01",
            startDate: new Date("2024-01-01T08:00:00.000Z"),
            endDate: new Date("2024-01-05T08:00:00.000Z")
        };

        await expect(findExtraWorkPeriodByEmployeeIdUseCase.execute(result)).rejects.toThrow(ExtraWorkPeriodNotFoundException);
    });

    it("cannot find extra work period by employeeId and createdAt with generic error", async () => {
        extraWorkPeriodRepositoryMock.findByEmployeeAndTimeWindow.mockRejectedValue(new Error());

        const findExtraWorkPeriodByEmployeeIdUseCase = new FindExtraWorkPeriodByEmployeeIdUseCase(
            extraWorkPeriodRepositoryMock
        );

        const result: findByEmployeeAndTimeWindowRequest = {
            employeeId: "employeeId-01",
            startDate: new Date("2024-01-01T08:00:00.000Z"),
            endDate: new Date("2024-01-05T08:00:00.000Z")
        };

        await expect(findExtraWorkPeriodByEmployeeIdUseCase.execute(result)).rejects.toThrow(FindByEmployeeAndTimeWindowException);
    });

    it("cannot find extra work period by employeeId and createdAt with employee not found error", async () => {
        extraWorkPeriodRepositoryMock.findByEmployeeAndTimeWindow.mockRejectedValue({
            code: PRISMA_NOT_FOUND_EXCEPTION
        });

        const findExtraWorkPeriodByEmployeeIdUseCase = new FindExtraWorkPeriodByEmployeeIdUseCase(
            extraWorkPeriodRepositoryMock
        );

        const result: findByEmployeeAndTimeWindowRequest = {
            employeeId: "employeeId-01",
            startDate: new Date("2024-01-01T08:00:00.000Z"),
            endDate: new Date("2024-01-05T08:00:00.000Z")
        };

        await expect(findExtraWorkPeriodByEmployeeIdUseCase.execute(result)).rejects.toThrow(
            EmployeeIdNotFoundException
        );
    });
});
