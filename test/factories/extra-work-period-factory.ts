import {
    ExtraWorkPeriod,
    ExtraWorkPeriodProps,
} from "@/domain/entities/extra-work-period-entity";
import { ExtraWorkPeriodRepository } from "@/infra/database/repositories/extra-work-period-repository";
import { faker } from "@faker-js/faker";

type ExtraWorkPeriodOverrides = {
  id?: string;
  workPeriodId?: string;
  employeeId?: string;
  startExtraWorkHour?: Date;
  finishedExtraWorkHour?: Date;
  startExtraBreakHour?: Date;
  finishedExtraBreakHour?: Date;
  lat?: string;
  lng?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export function makeFakeExtraWorkPeriod(data = {} as ExtraWorkPeriodOverrides) {
    const startExtraWorkHour = faker.date.recent();
    const finishedExtraWorkHour = faker.date.future();
    const startExtraBreakHour = faker.date.recent();
    const finishedExtraBreakHour = faker.date.future();
    const lat = faker.location.latitude();
    const lng = faker.location.longitude();
    const createdAt = faker.date.past();
    const updatedAt = faker.date.future();

    const props: ExtraWorkPeriodProps = {
        id: data.id ? data.id : "",
        workPeriodId: data.workPeriodId ? data.workPeriodId : "",
        employeeId: data.employeeId ? data.employeeId : "",
        lat: data.lat || String(lat),
        lng: data.lng || String(lng),
        startExtraWorkHour: data.startExtraWorkHour || startExtraWorkHour,
        finishedExtraWorkHour: data.finishedExtraWorkHour || finishedExtraWorkHour,
        startExtraBreakHour: data.startExtraBreakHour || startExtraBreakHour,
        finishedExtraBreakHour:
      data.finishedExtraBreakHour || finishedExtraBreakHour,
        createdAt: data.createdAt || createdAt,
        updatedAt: data.createdAt || updatedAt,
    };

    const extraworkperiod = ExtraWorkPeriod.create(props);

    return extraworkperiod;
}

export class ExtraWorkPeriodFactory {
    constructor(private extraWorkPeriodRepository: ExtraWorkPeriodRepository) {}

    async makeExtraWorkPeriod(
        data = {} as ExtraWorkPeriodOverrides
    ): Promise<ExtraWorkPeriod> {
        const extraWorkPeriod = makeFakeExtraWorkPeriod(data);

        const extraWorkPeriodToCreate = new ExtraWorkPeriod({
            ...extraWorkPeriod.props,
            workPeriodId: extraWorkPeriod.workPeriodId,
            startExtraWorkHour: extraWorkPeriod.startExtraWorkHour,
            employeeId: extraWorkPeriod.employeeId,
            finishedExtraWorkHour: extraWorkPeriod.finishedExtraWorkHour,
            lat: extraWorkPeriod.lat,
            lng: extraWorkPeriod.lng,
            startExtraBreakHour: extraWorkPeriod.startExtraBreakHour,
            finishedExtraBreakHour: extraWorkPeriod.finishedExtraBreakHour,
        });

        return await this.extraWorkPeriodRepository.create(extraWorkPeriodToCreate);
    }
}
