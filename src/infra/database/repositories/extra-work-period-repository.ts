import { ExtraWorkPeriod } from "@/domain/entities/extra-work-period-entity";
import { ExtraWorkPeriodRequest } from "@/domain/interfaces/extra-work-period";
import { findByEmployeeAndTimeWindowRequest } from "@/domain/interfaces/work-period-register";

export interface ExtraWorkPeriodRepository {
  create(extraWorkPeriod: ExtraWorkPeriod): Promise<ExtraWorkPeriod>;
  listByWorkPeriod({ pagination: { page, take }, workPeriodId }: ExtraWorkPeriodRequest): Promise<ExtraWorkPeriod[]>;
  findByEmployeeAndTimeWindow({ employeeId, endDate, startDate }: findByEmployeeAndTimeWindowRequest): Promise<ExtraWorkPeriod[] | null>;
}
