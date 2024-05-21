import { WeekdayEnum } from "@/domain/enum/week-day-enum";
import { InMemoryWorkPeriodRepository } from "@/infra/database/in-memory-repository/in-memory-work-period-repository";
import { PRISMA_NOT_FOUND_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { makeFakeWorkPeriod } from "test/factories/work-period-factory";
import { workPeriodRepositoryMock } from "test/mock/work-period-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { EmployeeIdNotFoundException } from "../../errors/employee-id-not-found";
import { FindWorkPeriodByCodWorkPeriodAndDayUseCase } from "./find-workperiod-by-code-work-period-and-day";

describe("FindWorkPeriodByCodWorkPeriodAndDayTimeWindowUseCase", () => {
    let workPeriodRepository: InMemoryWorkPeriodRepository;
    let findWorkPeriodByCodWorkPeriodUseCase: FindWorkPeriodByCodWorkPeriodAndDayUseCase;

    beforeEach(() => {
        workPeriodRepository = new InMemoryWorkPeriodRepository();
        findWorkPeriodByCodWorkPeriodUseCase = new FindWorkPeriodByCodWorkPeriodAndDayUseCase(workPeriodRepository);
    });

    it("should be able to find work period register by codWorkPeriod and day", async () => {

        const workPeriod = makeFakeWorkPeriod({ codWorkPeriod: "COD-01", id: "workPeriodId-01", workPeriods: [{ day: WeekdayEnum.Friday }] });

        workPeriodRepository.create(workPeriod);

        const output = await findWorkPeriodByCodWorkPeriodUseCase.execute(workPeriod.codWorkPeriod!, workPeriod.workPeriods[0].day);

        expect(output?.id).toEqual("workPeriodId-01");

    });

    it("cannot find work period register by codWorkPeriod and day with generic error", async () => {
        workPeriodRepositoryMock.findByCodWorkPeriodAndDay.mockRejectedValue(new Error());

        const findWorkPeriodByCodWorkPeriodUseCase = new FindWorkPeriodByCodWorkPeriodAndDayUseCase(
            workPeriodRepositoryMock
        );
        const workPeriod = makeFakeWorkPeriod();

        await expect(findWorkPeriodByCodWorkPeriodUseCase.execute(workPeriod.codWorkPeriod!, workPeriod.workPeriods[0].day)).rejects.toThrow(FindWorkPeriodByCodWorkPeriodAndDayUseCase);
    });

    it("cannot find work period register by  codWorkPeriod and day with employeeId not found error", async () => {
        workPeriodRepositoryMock.findByCodWorkPeriodAndDay.mockRejectedValue({
            code: PRISMA_NOT_FOUND_EXCEPTION
        });

        const findWorkPeriodByEmployeeIdAndTimeWindowUseCase = new FindWorkPeriodByCodWorkPeriodAndDayUseCase(
            workPeriodRepositoryMock
        );

        const workPeriod = makeFakeWorkPeriod();

        await expect(findWorkPeriodByEmployeeIdAndTimeWindowUseCase.execute(workPeriod.codWorkPeriod!, workPeriod.workPeriods[0].day)).rejects.toThrow(
            EmployeeIdNotFoundException
        );
    });
});
