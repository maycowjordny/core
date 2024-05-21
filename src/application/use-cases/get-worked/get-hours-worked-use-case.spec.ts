import { InMemoryWorkPeriodRegisterRepository } from "@/infra/database/in-memory-repository/in-memory-work-period-register-repository";
import { InMemoryWorkPeriodRepository } from "@/infra/database/in-memory-repository/in-memory-work-period-repository";
import { makeFakeWorkPeriod } from "test/factories/work-period-factory";
import { makeFakeWorkPeriodRegister } from "test/factories/work-period-register-factory";
import { beforeEach, describe, expect, it } from "vitest";
import { GetHoursWorkedException } from "./errors/get-worked-exception";
import { GetHoursWorkedUseCase } from "./get-hours-worked-use-case";

describe("GetHoursWorkedUseCase", () => {
    let getHoursWorkedUseCase: GetHoursWorkedUseCase;
    let workPeriodRegisterInMemoryRepository: InMemoryWorkPeriodRegisterRepository;
    let workPeriodInMemoryRepository: InMemoryWorkPeriodRepository;

    beforeEach(() => {
        getHoursWorkedUseCase = new GetHoursWorkedUseCase();
        workPeriodRegisterInMemoryRepository = new InMemoryWorkPeriodRegisterRepository();
        workPeriodInMemoryRepository = new InMemoryWorkPeriodRepository();
    });

    it("should able to capture hours worked in seconds", async () => {
        const eightHourInSeconds = 28800;

        const workPeriod = makeFakeWorkPeriodRegister({
            startWorkHour: new Date("2024-01-17T08:00:00.000Z"),
            startBreakHour: new Date("2024-01-17T12:00:00.000Z"),
            finishedBreakHour: new Date("2024-01-17T14:00:00.000Z"),
            finishedWorkHour: new Date("2024-01-17T18:00:00.000Z"),
        });

        const createWorkPeriod = await workPeriodRegisterInMemoryRepository.create(workPeriod);

        const output = getHoursWorkedUseCase.execute(createWorkPeriod);

        expect(output).toEqual(eightHourInSeconds);

    });

    it("should able to capture hours worked in seconds of work period", async () => {
        const eightHourInSeconds = 28800;

        const workPeriod = makeFakeWorkPeriod();

        const createWorkPeriod = await workPeriodInMemoryRepository.create(workPeriod);

        const [output] = createWorkPeriod.workPeriods.map(wp => getHoursWorkedUseCase.execute(wp));

        expect(output).toEqual(eightHourInSeconds);

    });

    it("cannot to capture hours worked in seconds when invalid Date", async () => {
        const workPeriod = makeFakeWorkPeriodRegister({
            startWorkHour: new Date("invalidDate"),
            startBreakHour: new Date("invalidDate"),
            finishedBreakHour: new Date("invalidDate"),
            finishedWorkHour: new Date("invalidDate"),
        });

        expect(() => getHoursWorkedUseCase.execute(workPeriod)).toThrow(GetHoursWorkedException);
    });
});

