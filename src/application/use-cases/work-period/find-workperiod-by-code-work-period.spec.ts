import { WeekdayEnum } from "@/domain/enum/week-day-enum";
import { InMemoryWorkPeriodRepository } from "@/infra/database/in-memory-repository/in-memory-work-period-repository";
import { PRISMA_NOT_FOUND_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { makeFakeWorkPeriod } from "test/factories/work-period-factory";
import { workPeriodRepositoryMock } from "test/mock/work-period-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { EmployeeIdNotFoundException } from "../../errors/employee-id-not-found";
import { FindWorkPeriodByCodWorkPeriodUseCase } from "./find-workperiod-by-code-work-period";

describe("FindWorkPeriodByCodWorkPeriodTimeWindowUseCase", () => {
    let workPeriodRepository: InMemoryWorkPeriodRepository;
    let findWorkPeriodByCodWorkPeriodUseCase: FindWorkPeriodByCodWorkPeriodUseCase;

    beforeEach(() => {
        workPeriodRepository = new InMemoryWorkPeriodRepository();
        findWorkPeriodByCodWorkPeriodUseCase = new FindWorkPeriodByCodWorkPeriodUseCase(workPeriodRepository);
    });

    it("should be able to find work period register by codWorkPeriod", async () => {

        const workPeriod = makeFakeWorkPeriod({ codWorkPeriod: "COD-01", id: "workPeriodId-01", workPeriods: [{ day: WeekdayEnum.Friday }] });

        workPeriodRepository.create(workPeriod);

        const output = await findWorkPeriodByCodWorkPeriodUseCase.execute(workPeriod.codWorkPeriod!);

        expect(output?.id).toEqual("workPeriodId-01");

    });

    it("cannot find work period register by codWorkPeriod with generic error", async () => {
        workPeriodRepositoryMock.findByCodWorkPeriod.mockRejectedValue(new Error());

        const findWorkPeriodByCodWorkPeriodUseCase = new FindWorkPeriodByCodWorkPeriodUseCase(
            workPeriodRepositoryMock
        );
        const workPeriod = makeFakeWorkPeriod();

        await expect(findWorkPeriodByCodWorkPeriodUseCase.execute(workPeriod.codWorkPeriod!)).rejects.toThrow(FindWorkPeriodByCodWorkPeriodUseCase);
    });

    it("cannot find work period register by  codWorkPeriod with employeeId not found error", async () => {
        workPeriodRepositoryMock.findByCodWorkPeriod.mockRejectedValue({
            code: PRISMA_NOT_FOUND_EXCEPTION
        });

        const findWorkPeriodByEmployeeIdAndTimeWindowUseCase = new FindWorkPeriodByCodWorkPeriodUseCase(
            workPeriodRepositoryMock
        );

        const workPeriod = makeFakeWorkPeriod();

        await expect(findWorkPeriodByEmployeeIdAndTimeWindowUseCase.execute(workPeriod.codWorkPeriod!)).rejects.toThrow(
            EmployeeIdNotFoundException
        );
    });
});
