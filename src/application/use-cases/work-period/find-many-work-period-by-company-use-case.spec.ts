import { InMemoryWorkPeriodRepository } from "@/infra/database/in-memory-repository/in-memory-work-period-repository";
import { PRISMA_NOT_FOUND_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { makeFakeWorkPeriod } from "test/factories/work-period-factory";
import { workPeriodRepositoryMock } from "test/mock/work-period-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { CompanyIdNotFoundException } from "./errors/companyId-not-found-exception";
import { FindManyWorkPeriodByCompanyIdException } from "./errors/list-work-period-exception-by-company";
import { FindManyWorkPeriodByCompanyIdUseCase } from "./find-many-work-period-by-company-use-case";

describe("FindManyWorkPeriodByCompanyUseCase", () => {
    let workPeriodRepository: InMemoryWorkPeriodRepository;
    let findManyWorkPeriodByCompanyUseCase: FindManyWorkPeriodByCompanyIdUseCase;

    beforeEach(() => {
        workPeriodRepository = new InMemoryWorkPeriodRepository();
        findManyWorkPeriodByCompanyUseCase = new FindManyWorkPeriodByCompanyIdUseCase(workPeriodRepository);
    });

    it("should be able find many work period by companyId", async () => {

        for (let i = 1; i <= 5; i++) {
            const workPeriod = makeFakeWorkPeriod({ id: `workPeriodId-${i}`, companyId: "companyId-01" });
            workPeriodRepository.create(workPeriod);
        }

        const output = await findManyWorkPeriodByCompanyUseCase.execute("companyId-01");

        expect(output).toHaveLength(5);
    });

    it("cannot find many work period by companyId when generic error", async () => {
        workPeriodRepositoryMock.findManyByCompany.mockRejectedValue(Error);

        const findManyWorkPeriodByCompanyUseCase = new FindManyWorkPeriodByCompanyIdUseCase(
            workPeriodRepositoryMock
        );

        const { companyId } = makeFakeWorkPeriod({ companyId: "companyId-01" }, 1);

        await expect(findManyWorkPeriodByCompanyUseCase.execute(companyId)).rejects.toThrow(FindManyWorkPeriodByCompanyIdException);
    });

    it("cannot find many work period by companyId not found error", async () => {
        workPeriodRepositoryMock.findManyByCompany.mockRejectedValue({ code: PRISMA_NOT_FOUND_EXCEPTION });

        const findManyWorkPeriodByCompanyUseCase = new FindManyWorkPeriodByCompanyIdUseCase(
            workPeriodRepositoryMock
        );

        const { companyId } = makeFakeWorkPeriod({ companyId: "companyId-01" }, 1);

        await expect(findManyWorkPeriodByCompanyUseCase.execute(companyId)).rejects.toThrow(CompanyIdNotFoundException);
    });
});
