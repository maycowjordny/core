import { InMemoryWorkPeriodRepository } from "@/infra/database/in-memory-repository/in-memory-work-period-repository";
import { makeFakeWorkPeriod } from "test/factories/work-period-factory";
import { workPeriodRepositoryMock } from "test/mock/work-period-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateWorkPeriodUseCase } from "./create-work-period-use-case";
import { CreateWorkPeriodException } from "./errors/work-period-create-exception";

describe("CreateWorkPeriodUseCase", () => {
    let workPeriodRepository: InMemoryWorkPeriodRepository;
    let workPeriodUseCase: CreateWorkPeriodUseCase;

    beforeEach(() => {
        workPeriodRepository = new InMemoryWorkPeriodRepository();
        workPeriodUseCase = new CreateWorkPeriodUseCase(workPeriodRepository);
    });

    it("should be able to create work period", async () => {
        const workPeriod = makeFakeWorkPeriod();

        const output = await workPeriodUseCase.execute(workPeriod);

        expect(output).toMatchObject(workPeriod);
    });

    it("cannot create a work period when generic error", async () => {
        workPeriodRepositoryMock.create.mockRejectedValue(new Error());

        const createWorkPeriodUseCase = new CreateWorkPeriodUseCase(
            workPeriodRepositoryMock
        );

        const workPeriod = makeFakeWorkPeriod({}, 1);

        await expect(createWorkPeriodUseCase.execute(workPeriod)).rejects.toThrow(
            CreateWorkPeriodException
        );
    });
});
