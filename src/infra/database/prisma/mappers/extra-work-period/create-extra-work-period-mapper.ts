import { ExtraWorkPeriod } from "@/domain/entities/extra-work-period-entity";
import { Prisma } from "@prisma/client";
import { ExtraWorkPeriodMapper } from "./extra-work-period-mapper";

export class CreateExtraWorkPeriodMapper extends ExtraWorkPeriodMapper {
    static convertToPrisma(extraWorkPeriod: ExtraWorkPeriod): Prisma.ExtraWorkPeriodUncheckedCreateInput {
        return {
            workPeriodId: extraWorkPeriod.workPeriodId!,
            startExtraWorkHour: extraWorkPeriod.startExtraWorkHour,
            finishedExtraWorkHour: extraWorkPeriod.finishedExtraWorkHour,
            startExtraBreakHour: extraWorkPeriod.startExtraWorkHour,
            finishedExtraBreakHour: extraWorkPeriod.finishedExtraWorkHour,
            lat: extraWorkPeriod.lat,
            lng: extraWorkPeriod.lng,
            employeeId: extraWorkPeriod.employeeId!
        };
    }
}

