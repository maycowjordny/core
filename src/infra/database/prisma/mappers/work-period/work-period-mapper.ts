import { WorkPeriod } from "@/domain/entities/work-period-entity";
import { WeekdayEnum } from "@/domain/enum/week-day-enum";
import { UpdateWorkPeriodProps, WorkPeriods } from "@/domain/interfaces/work-period";
import { WorkPeriod as RawWorkPeriod } from "@prisma/client";

export class WorkPeriodMapper {

    static toDomain(raw: RawWorkPeriod): WorkPeriod {

        const workPeriodDay: WorkPeriods[] = [{
            day: raw.day as WeekdayEnum,
            finishedBreakHour: raw.finishedBreakHour,
            finishedWorkHour: raw.finishedWorkHour,
            name: raw.name,
            startBreakHour: raw.startBreakHour,
            startWorkHour: raw.startWorkHour,
        }];

        const workPeriod = new WorkPeriod({
            companyId: raw.companyId,
            codWorkPeriod: raw.codWorkPeriod,
            workPeriods: workPeriodDay
        });

        return workPeriod;
    }

    static toDomainFromList(raw: RawWorkPeriod[]): WorkPeriod {
        const workPeriodList: WorkPeriods[] = [];

        raw.forEach(element => {
            const workPeriodDay: WorkPeriods = {
                day: element.day as WeekdayEnum,
                finishedBreakHour: element.finishedBreakHour,
                finishedWorkHour: element.finishedWorkHour,
                name: element.name,
                startBreakHour: element.startBreakHour,
                startWorkHour: element.startWorkHour,
            };
            workPeriodList.push(workPeriodDay);
        });

        const workPeriod = new WorkPeriod({
            companyId: raw[0].companyId,
            codWorkPeriod: raw[0].codWorkPeriod,
            workPeriods: workPeriodList
        });

        return workPeriod;
    }

    static toDomainFromUpdate(raw: UpdateWorkPeriodProps): WorkPeriod {
        const workPeriodList: WorkPeriods[] = [];

        raw.workPeriods.forEach(element => {
            const workPeriodDay: WorkPeriods = {
                day: element.day as WeekdayEnum,
                finishedBreakHour: element.finishedBreakHour,
                finishedWorkHour: element.finishedWorkHour,
                name: element.name,
                startBreakHour: element.startBreakHour,
                startWorkHour: element.startWorkHour,
            };
            workPeriodList.push(workPeriodDay);
        });

        const workPeriod = new WorkPeriod({
            companyId: raw.companyId,
            codWorkPeriod: raw.codWorkPeriod,
            workPeriods: workPeriodList
        });

        return workPeriod;
    }

}
