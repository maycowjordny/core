import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryExtraWorkPeriodRepository } from "@/infra/database/in-memory-repository/in-memory-extra-work-period-repository";
import { CreateExtraWorkPeriodUseCase } from "./create-extra-work-period-use-case";
import { CreateExtraWorkPeriodException } from "./errors/create-extra-work-period-exception";
import { extraWorkPeriodRepositoryMock } from "test/mock/extra-work-period-mock";
import { makeFakeExtraWorkPeriod } from "test/factories/extra-work-period-factory";

describe("CreateExtraWorkPeriodUseCase", () => {
    let extraWorkPeriodRepository: InMemoryExtraWorkPeriodRepository;
    let extraWorkPeriodUseCase: CreateExtraWorkPeriodUseCase;

    beforeEach(() => {
        extraWorkPeriodRepository = new InMemoryExtraWorkPeriodRepository();
        extraWorkPeriodUseCase = new CreateExtraWorkPeriodUseCase(extraWorkPeriodRepository);
    });

    it("should be able to create extra work period", async () => {
        const extraWorkPeriod = makeFakeExtraWorkPeriod();

        const output = await extraWorkPeriodUseCase.execute(extraWorkPeriod);

        expect(output).toMatchObject(extraWorkPeriod);
    });

    it("cannot create a extra work period when generic error", async () => {
        extraWorkPeriodRepositoryMock.create.mockRejectedValue(new Error());

        const createExtraWorkPeriodUseCase = new CreateExtraWorkPeriodUseCase(extraWorkPeriodRepositoryMock);

        const extraWorkPeriod = makeFakeExtraWorkPeriod();

        await expect(createExtraWorkPeriodUseCase.execute(extraWorkPeriod)).rejects.toThrow(CreateExtraWorkPeriodException);
    });
});
