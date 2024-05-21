import { WorkPeriodRegister, WorkPeriodRegisterProps } from "@/domain/entities/work-period-register-entity";
import { prisma } from "@/infra/database/lib/prisma";
import { CreateWorkPeriodRegister } from "@/infra/database/prisma/mappers/work-period-register/create-work-period-register-mapper";
import { WorkPeriodRegisterMapper } from "@/infra/database/prisma/mappers/work-period-register/work-period-register-mapper";
import { faker } from "@faker-js/faker";

type WorkPeriodRegisterOverrides = {
    id?: string;
    workPeriodId?: string;
    employeeId?: string;
    startWorkHour?: Date | null;
    finishedWorkHour?: Date | null;
    startBreakHour?: Date | null;
    finishedBreakHour?: Date | null;
    lat?: string;
    lng?: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export function makeFakeWorkPeriodRegister(
    data = {} as WorkPeriodRegisterOverrides
) {
    const startWorkHour = new Date("2024-01-17T08:00:00.000Z");
    const startBreakHour = new Date("2024-01-17T12:00:00.000Z");
    const finishedBreakHour = new Date("2024-01-17T14:00:00.000Z");
    const finishedWorkHour = new Date("2024-01-17T18:00:00.000Z");
    const lat = faker.location.latitude();
    const lng = faker.location.longitude();
    const createdAt = faker.date.past();
    const updatedAt = faker.date.future();

    const props: WorkPeriodRegisterProps = {
        id: data.id ? data.id : "",
        workPeriodId: data.workPeriodId ? data.workPeriodId : "",
        employeeId: data.employeeId ? data.employeeId : "",
        lat: data.lat || String(lat),
        lng: data.lng || String(lng),
        startWorkHour: data.startWorkHour !== undefined ? data.startWorkHour! : startWorkHour,
        startBreakHour: data.startBreakHour !== undefined ? data.startBreakHour! : startBreakHour,
        finishedBreakHour: data.finishedBreakHour !== undefined ? data.finishedBreakHour! : finishedBreakHour,
        finishedWorkHour: data.finishedWorkHour !== undefined ? data.finishedWorkHour! : finishedWorkHour,
        createdAt: data.createdAt || createdAt,
        updatedAt: data.createdAt || updatedAt,
    };

    const workperiodregister = WorkPeriodRegister.create(props);

    return workperiodregister;
}

export class WorkPeriodRegisterFactory {
    constructor() { }

    async makeWorkPeriodRegister(data = {} as WorkPeriodRegisterOverrides): Promise<WorkPeriodRegister> {
        const workPeriodRegister = makeFakeWorkPeriodRegister(data);

        const result = await prisma.workPeriodRegister.create({
            data: CreateWorkPeriodRegister.convertToPrisma(workPeriodRegister)
        });

        return WorkPeriodRegisterMapper.toDomain(result);
    }
}
