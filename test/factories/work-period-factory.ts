import { WorkPeriod, WorkPeriodProps } from "@/domain/entities/work-period-entity";
import { WeekdayEnum } from "@/domain/enum/week-day-enum";
import { WorkPeriods } from "@/domain/interfaces/work-period";
import { prisma } from "@/infra/database/lib/prisma";
import { CreateWorkPeriodMapper } from "@/infra/database/prisma/mappers/work-period/create-work-period-mapper";
import { faker } from "@faker-js/faker";

type WorkPeriodOverrides = {
    id?: string;
    codWorkPeriod?: string;
    companyId?: string;
    workPeriods?: WorkPeriodsOverrides[],
    createdAt?: Date;
    updatedAt?: Date;
};

type WorkPeriodsOverrides = {
    day?: WeekdayEnum
    name?: string;
    startWorkHour?: Date;
    finishedWorkHour?: Date;
    startBreakHour?: Date;
    finishedBreakHour?: Date;
};

export function makeFakeWorkPeriod(data = {} as WorkPeriodOverrides, numPeriods: number = 1) {
    const codWorkPeriod = faker.string.uuid();
    const createdAt = faker.date.past();
    const updatedAt = faker.date.future();

    const props: WorkPeriodProps = {
        id: data.id || "",
        codWorkPeriod: data.codWorkPeriod || codWorkPeriod,
        workPeriods: makeFakeWorkPeriods(data.workPeriods, numPeriods),
        companyId: data.companyId || "",
        createdAt: createdAt,
        updatedAt: data.updatedAt || updatedAt,
    };

    const workperiod = WorkPeriod.create(props);

    return workperiod;
}

function makeFakeWorkPeriods(datas: WorkPeriodsOverrides[] = [], numPeriods: number = 1): WorkPeriods[] {
    const workPeriods: WorkPeriods[] = [];

    for (let i = 0; i < numPeriods; i++) {
        const data = datas[i] || {};
        const dayDate = (i + 1).toString().padStart(2, "0");

        const name = data.name || faker.lorem.word();
        const startWorkHour = data.startWorkHour || new Date(`2024-03-${dayDate}T08:00:00.000Z`);
        const startBreakHour = data.startBreakHour || new Date(`2024-03-${dayDate}T12:00:00.000Z`);
        const finishedBreakHour = data.finishedBreakHour || new Date(`2024-03-${dayDate}T14:00:00.000Z`);
        const finishedWorkHour = data.finishedWorkHour || new Date(`2024-03-${dayDate}T18:00:00.000Z`);
        const day = data.day !== undefined ? data.day : WeekdayEnum.Monday;

        const workPeriod: WorkPeriods = {
            name,
            day,
            startWorkHour,
            finishedWorkHour,
            startBreakHour,
            finishedBreakHour,
        };

        workPeriods.push(workPeriod);
    }

    return workPeriods;
}

export class WorkPeriodFactory {
    constructor() { }

    async makeWorkPeriod(data = {} as WorkPeriodOverrides, numPeriods: number = 1): Promise<WorkPeriod> {
        const workperiod = makeFakeWorkPeriod(data, numPeriods);

        await prisma.workPeriod.createMany({ data: CreateWorkPeriodMapper.convertToPrisma(workperiod) });

        return workperiod;
    }
}
