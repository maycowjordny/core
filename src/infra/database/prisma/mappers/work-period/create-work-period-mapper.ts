import { WorkPeriod } from "@/domain/entities/work-period-entity";
import { Prisma } from "@prisma/client";
import { WorkPeriodMapper } from "./work-period-mapper";

export class CreateWorkPeriodMapper extends WorkPeriodMapper {
    static convertToPrisma(workPeriod: WorkPeriod): Prisma.WorkPeriodCreateManyInput[] {
        const workPeriodList: Prisma.WorkPeriodCreateManyInput[] = [];
        workPeriod.workPeriods.forEach(period => {
            const workPeriodInput = {
                name: period.name,
                codWorkPeriod: workPeriod.codWorkPeriod!,
                day: period.day,
                companyId: workPeriod.companyId,
                startWorkHour: period.startWorkHour,
                finishedWorkHour: period.finishedWorkHour,
                finishedBreakHour: period.finishedBreakHour,
                startBreakHour: period.startBreakHour,
            };

            workPeriodList.push(workPeriodInput);
        });

        return workPeriodList;
    }

}
