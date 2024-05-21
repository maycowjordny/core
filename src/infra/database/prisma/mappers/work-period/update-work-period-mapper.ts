import { UpdateWorkPeriodProps } from "@/domain/interfaces/work-period";
import { Prisma } from "@prisma/client";
import { WorkPeriodMapper } from "./work-period-mapper";

export class UpdateWorkPeriodMapper extends WorkPeriodMapper {
    static convertToPrisma(workPeriod: UpdateWorkPeriodProps): Prisma.WorkPeriodUpdateInput {
        return {
            codWorkPeriod: workPeriod.codWorkPeriod,
            company: { connect: { id: workPeriod.companyId } },
            name: workPeriod.name,
            startWorkHour: workPeriod.startWorkHour,
            finishedWorkHour: workPeriod.finishedWorkHour,
            finishedBreakHour: workPeriod.finishedBreakHour,
            startBreakHour: workPeriod.startBreakHour
        };
    }

}
