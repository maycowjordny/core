import { InMemoryWorkPeriodRepository } from "@/infra/database/in-memory-repository/in-memory-work-period-repository";
import { makeFakeWorkPeriod } from "test/factories/work-period-factory";
import { beforeEach, describe, expect, it } from "vitest";
import { GetDaysOffAndDaysWorkedUseCase } from "./get-days-off-and-days-worked";

describe("GetHoursWorkedUseCase", () => {
    let getDaysOffAndDaysWorkedUseCase: GetDaysOffAndDaysWorkedUseCase;
    let workPeriodRepository: InMemoryWorkPeriodRepository;

    beforeEach(() => {
        workPeriodRepository = new InMemoryWorkPeriodRepository();
        getDaysOffAndDaysWorkedUseCase = new GetDaysOffAndDaysWorkedUseCase();
    });

    it("should able to capture days off and days worked", async () => {
        const list = [];

        const fakeWorkPeriod = makeFakeWorkPeriod({
            id: "workPeriodId-01",
            createdAt: new Date("2024-03-01T08:00:00.000Z")
        }, 31);
        const createList = await workPeriodRepository.create(fakeWorkPeriod);

        list.push(createList);

        const output = await getDaysOffAndDaysWorkedUseCase.execute(list.flatMap(wp => wp.workPeriods));

        const expectedDayOffs = [
            "2024-03-03", "2024-03-10", "2024-03-17", "2024-03-19",
            "2024-03-24", "2024-03-25", "2024-03-29", "2024-03-31"
        ].map(date => new Date(`${date}T03:00:00.000Z`));

        const expectedWorkingDays = [
            "2024-03-01", "2024-03-02", "2024-03-04", "2024-03-05",
            "2024-03-06", "2024-03-07", "2024-03-08", "2024-03-09",
            "2024-03-11", "2024-03-12", "2024-03-13", "2024-03-14",
            "2024-03-15", "2024-03-16", "2024-03-18", "2024-03-20",
            "2024-03-21", "2024-03-22", "2024-03-23", "2024-03-26",
            "2024-03-27", "2024-03-28", "2024-03-30"
        ].map(date => new Date(`${date}T03:00:00.000Z`));

        expect(output).toMatchObject({
            totalDayOffs: expectedDayOffs,
            totalWorkingDays: expectedWorkingDays
        });
    });

});

