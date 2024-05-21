import { beforeEach, describe, expect, it } from "vitest";
import { ListExtraWorkPeriodByWorkPeriodIdUseCase } from "./fetch-extra-work-period-by-work-period-id-use-case";
import { makeFakeExtraWorkPeriod } from "test/factories/extra-work-period-factory";
import { extraWorkPeriodRepositoryMock } from "test/mock/extra-work-period-mock";
import { ListExtraWorkPeriodByWorkPeriodIdException } from "./errors/list-extra-work-period-by-work-period-id-exception";
import { InMemoryExtraWorkPeriodRepository } from "@/infra/database/in-memory-repository/in-memory-extra-work-period-repository";
import { ExtraWorkPeriodRequest } from "@/domain/interfaces/extra-work-period";

describe("ListExtraWorkPeriodByWorkPeriodIdUseCase", () => {
    let extraWorkPeriodRepository: InMemoryExtraWorkPeriodRepository;
    let workPeriodUseCase: ListExtraWorkPeriodByWorkPeriodIdUseCase;

    beforeEach(() => {
        extraWorkPeriodRepository = new InMemoryExtraWorkPeriodRepository();
        workPeriodUseCase = new ListExtraWorkPeriodByWorkPeriodIdUseCase(extraWorkPeriodRepository);
    });

    it("should be able to fetch two work period by workPeriodId and test pagination", async () => {

        const extraWorkPeriodOne = makeFakeExtraWorkPeriod({
            id: "extra-work-period-01",
            workPeriodId: "workPeriodId-1",
        });

        extraWorkPeriodRepository.create(extraWorkPeriodOne);

        const extraWorkPeriodTwo = makeFakeExtraWorkPeriod({
            id: "extra-work-period-02",
            workPeriodId: "workPeriodId-2",
        });

        extraWorkPeriodRepository.create(extraWorkPeriodTwo);

        const extraWorkPeriodThree = makeFakeExtraWorkPeriod({
            id: "extra-work-period-03",
            workPeriodId: "workPeriodId-2",
        });

        extraWorkPeriodRepository.create(extraWorkPeriodThree);

        const extraWorkPeriodList: ExtraWorkPeriodRequest = {
            workPeriodId: "workPeriodId-2",
            pagination: {
                page: 1,
                take: 20,
            },
        };

        const output = await workPeriodUseCase.execute(extraWorkPeriodList);

        expect(output).toHaveLength(2);
    });

    it("should be able to fetch two work period by employee and test pagination", async () => {
        for (let i = 1; i <= 22; i++) {
            const extraWorkPeriod = makeFakeExtraWorkPeriod({
                id: `work-period-${i}`,
                workPeriodId: "workPeriodId-1",
            });

            extraWorkPeriodRepository.create(extraWorkPeriod);
        }

        const workPeriodList: ExtraWorkPeriodRequest = {
            workPeriodId: "workPeriodId-1",
            pagination: {
                page: 2,
                take: 20,
            },
        };

        const output = await workPeriodUseCase.execute(workPeriodList);

        expect(output).toHaveLength(2);
    });

    it("should return an empty work period by employee list", async () => {
        const workPeriodList: ExtraWorkPeriodRequest = {
            workPeriodId: "workPeriodId-1",
            pagination: {
                page: 1,
                take: 20,
            },
        };

        const output = await workPeriodUseCase.execute(workPeriodList);

        expect(output).toEqual([]);
    });

    it("cannot create a  work period when generic error", async () => {
        extraWorkPeriodRepositoryMock.listByWorkPeriod.mockRejectedValue(new Error());

        const listWorkPeriodUseCaseByEmployeeUseCase = new ListExtraWorkPeriodByWorkPeriodIdUseCase(
            extraWorkPeriodRepositoryMock
        );

        const workPeriodList: ExtraWorkPeriodRequest = {
            workPeriodId: "workPeriodId-1",
            pagination: {
                page: 1,
                take: 20,
            },
        };

        await expect(listWorkPeriodUseCaseByEmployeeUseCase.execute(workPeriodList))
            .rejects.toThrow(ListExtraWorkPeriodByWorkPeriodIdException);
    });
});
