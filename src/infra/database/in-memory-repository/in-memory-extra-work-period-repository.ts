import { ExtraWorkPeriod } from "@/domain/entities/extra-work-period-entity";
import { ExtraWorkPeriodRepository } from "../repositories/extra-work-period-repository";
import { ExtraWorkPeriodRequest } from "@/domain/interfaces/extra-work-period";
import { findByEmployeeAndTimeWindowRequest } from "@/domain/interfaces/work-period-register";

export class InMemoryExtraWorkPeriodRepository
implements ExtraWorkPeriodRepository {

    public items: Array<ExtraWorkPeriod> = [];

    async create(extraWorkPeriod: ExtraWorkPeriod): Promise<ExtraWorkPeriod> {
        this.items.push(extraWorkPeriod);

        return extraWorkPeriod;
    }

    async listByWorkPeriod({
        workPeriodId,
        pagination: { page, take },
    }: ExtraWorkPeriodRequest): Promise<ExtraWorkPeriod[]> {
        const workPeriod = this.items.filter(
            (item) => item.workPeriodId == workPeriodId
        );

        const result = workPeriod.slice((page - 1) * take, page * take);

        return result;
    }

    async findByEmployeeAndTimeWindow({ employeeId, endDate, startDate }: findByEmployeeAndTimeWindowRequest): Promise<ExtraWorkPeriod[] | null> {
        const result = this.items.filter((item) =>
            item.employeeId === employeeId
      && item.createdAt! >= startDate!
      && item.createdAt! <= endDate!);

        if (!result) return null;

        return result;
    }
}
