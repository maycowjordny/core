import { InMemoryWorkPeriodRepository } from "@/infra/database/in-memory-repository/in-memory-work-period-repository";
import { makeFakeWorkPeriod } from "test/factories/work-period-factory";
import { workPeriodRepositoryMock } from "test/mock/work-period-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { DeleteWorkPeriodUseCase } from "./delete-work-period-use-case";
import { DeleteWorkPeriodException } from "./errors/delete-absence-exception";

describe("DeleteWorkPeriodUseCase", () => {
    let workperiodRepository: InMemoryWorkPeriodRepository;
    let workperiodUseCase: DeleteWorkPeriodUseCase;

    beforeEach(() => {
        workperiodRepository = new InMemoryWorkPeriodRepository();
        workperiodUseCase = new DeleteWorkPeriodUseCase(workperiodRepository);
    });

    it("should be able to delete workperiod", async () => {
        const workperiod = makeFakeWorkPeriod({ id: "workperiodId-01" }, 1);

        workperiodRepository.create(workperiod);

        const output = await workperiodUseCase.execute(workperiod.id!);

        expect(output).toBeNull();
        expect(workperiodRepository.items.map(item => item)).toHaveLength(0);
    });

    it("cannot delete a workperiod when generic error", async () => {
        workPeriodRepositoryMock.delete.mockRejectedValue(Error);

        const deleteWorkPeriodUseCase = new DeleteWorkPeriodUseCase(workPeriodRepositoryMock);

        const workperiod = makeFakeWorkPeriod({}, 1);

        await expect(deleteWorkPeriodUseCase.execute(workperiod.id!)).rejects.toThrow(DeleteWorkPeriodException);
    });
});
