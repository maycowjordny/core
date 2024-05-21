import { ExtraWorkPeriod } from "@/domain/entities/extra-work-period-entity";
import { ExtraWorkPeriod as RawExtraWorkPeriod } from "@prisma/client";

export class ExtraWorkPeriodMapper {
    static toDomain(raw: RawExtraWorkPeriod): ExtraWorkPeriod {
        return new ExtraWorkPeriod({
            id: raw.id,
            workPeriodId: raw.workPeriodId,
            startExtraWorkHour: raw.startExtraWorkHour,
            finishedExtraWorkHour: raw.finishedExtraWorkHour,
            startExtraBreakHour: raw.startExtraWorkHour,
            finishedExtraBreakHour: raw.finishedExtraWorkHour,
            lat: raw.lat,
            lng: raw.lng,
        });
    }
}

