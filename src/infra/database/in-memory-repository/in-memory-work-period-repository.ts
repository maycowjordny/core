import { WorkPeriod } from "@/domain/entities/work-period-entity";
import { WeekdayEnum } from "@/domain/enum/week-day-enum";
import { UpdateWorkPeriodProps } from "@/domain/interfaces/work-period";
import { WorkPeriodRepository } from "../repositories/work-period-repository";

export class InMemoryWorkPeriodRepository implements WorkPeriodRepository {
    public items: Array<WorkPeriod> = [];

    async create(workPeriod: WorkPeriod): Promise<WorkPeriod> {
        this.items.push(workPeriod);

        return workPeriod;
    }

    async findByCodWorkPeriodAndDay(codWorkPeriod: string, day: WeekdayEnum): Promise<WorkPeriod> {
        const workperiod = this.items.filter((item) => item.codWorkPeriod == codWorkPeriod && item.workPeriods[0].day == day)[0];

        return workperiod;
    }

    async findByCodWorkPeriod(codWorkPeriod: string): Promise<WorkPeriod | null> {
        const workperiod = this.items.filter((item) => item.codWorkPeriod == codWorkPeriod)[0];

        return workperiod;
    }

    async findManyByCompany(companyId: string): Promise<WorkPeriod[]> {
        return this.items.filter((item) => item.companyId == companyId);

    }

    async update(workPeriod: UpdateWorkPeriodProps): Promise<WorkPeriod> {
        const workPeriods = this.items.filter((item) => item.codWorkPeriod == workPeriod.codWorkPeriod)[0];

        const newWorkPeriod = new WorkPeriod({
            ...workPeriods.props,
            workPeriods: workPeriod.workPeriods
        });

        return newWorkPeriod;
    }

    async delete(id: string): Promise<null> {
        const absence = this.items.findIndex((item) => item.id == id);

        if (absence !== -1) this.items.splice(absence, 1);

        return null;
    }
}
