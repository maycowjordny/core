import { WeekdayEnum } from "@/domain/enum/week-day-enum";
import { UpdateWorkPeriodProps } from "@/domain/interfaces/work-period";
import { InMemoryWorkPeriodRepository } from "@/infra/database/in-memory-repository/in-memory-work-period-repository";
import { PRISMA_NOT_FOUND_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { makeFakeWorkPeriod } from "test/factories/work-period-factory";
import { workPeriodRepositoryMock } from "test/mock/work-period-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { CompanyNotFoundException } from "../company/errors/not-found-company-exception";
import { UpdateWorkPeriodException } from "./errors/update-work-period-exception";
import { UpdateWorkPeriodUseCase } from "./update-work-period-use-case";

describe("UpdateWorkPeriodUseCase", () => {
    let workperiodsRepository: InMemoryWorkPeriodRepository;
    let updateWorkPeriodUseCase: UpdateWorkPeriodUseCase;

    beforeEach(() => {
        workperiodsRepository = new InMemoryWorkPeriodRepository();
        updateWorkPeriodUseCase = new UpdateWorkPeriodUseCase(workperiodsRepository);
    });

    it("should be able to update a workperiod", async () => {
        const workperiod = makeFakeWorkPeriod({
            id: "workPeriodId-01",
            companyId: "companyId-01",
            codWorkPeriod: "COD-01"
        });

        workperiodsRepository.create(workperiod);

        const response: UpdateWorkPeriodProps = {
            companyId: "companyId-01",
            codWorkPeriod: "COD-01",
            workPeriods: [{
                day: WeekdayEnum.Sunday,
                name: "Name test-01",
                startWorkHour: new Date("2024-03-08T15:53:01.032Z"),
                finishedWorkHour: new Date("2024-03-08T15:53:01.032Z"),
                startBreakHour: new Date("2024-03-08T15:53:01.032Z"),
                finishedBreakHour: new Date("2024-03-09T15:53:01.032Z")
            }]
        };

        const output = await updateWorkPeriodUseCase.execute(response);

        expect(output).toMatchObject(response);
    });

    it("cannot update an workperiod when generic error", async () => {
        workPeriodRepositoryMock.update.mockRejectedValue(new Error());

        const updateWorkPeriodUseCase = new UpdateWorkPeriodUseCase(workPeriodRepositoryMock);

        const workperiod = makeFakeWorkPeriod();

        await expect(updateWorkPeriodUseCase.execute({ ...workperiod.props, codWorkPeriod: workperiod.codWorkPeriod! })).rejects.toThrow(UpdateWorkPeriodException);
    });

    it("cannot update an workperiod when prisma not found error", async () => {
        workPeriodRepositoryMock.update.mockRejectedValue({ code: PRISMA_NOT_FOUND_EXCEPTION, });

        const updateWorkPeriodUseCase = new UpdateWorkPeriodUseCase(workPeriodRepositoryMock);

        const workperiod = makeFakeWorkPeriod();

        await expect(updateWorkPeriodUseCase.execute({ ...workperiod.props, codWorkPeriod: workperiod.codWorkPeriod! })).rejects.toThrow(CompanyNotFoundException);
    });
});
