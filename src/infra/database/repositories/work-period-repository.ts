import { WorkPeriod } from "@/domain/entities/work-period-entity";
import { WeekdayEnum } from "@/domain/enum/week-day-enum";
import { UpdateWorkPeriodProps } from "@/domain/interfaces/work-period";

export interface WorkPeriodRepository {
  create(workPeriod: WorkPeriod): Promise<WorkPeriod>;
  update(workPeriod: UpdateWorkPeriodProps): Promise<WorkPeriod>;
  delete(id: string): Promise<null>;
  findByCodWorkPeriodAndDay(codWorkPeriod: string, day: WeekdayEnum): Promise<WorkPeriod | null>;
  findByCodWorkPeriod(codWorkPeriod: string): Promise<WorkPeriod | null>;
  findManyByCompany(companyId: string): Promise<WorkPeriod[]>;
}
