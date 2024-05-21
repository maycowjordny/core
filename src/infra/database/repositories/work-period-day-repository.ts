import { WorkPeriodDay } from "@/domain/entities/work-period-day-entity";
import { UpdateworkPeriodDayProps } from "@/domain/interfaces/work-period-day";

export interface WorkPeriodDayRepository {
  create(workPeriodDay: WorkPeriodDay): Promise<WorkPeriodDay>;
  update(workPeriodDay: UpdateworkPeriodDayProps): Promise<WorkPeriodDay>;
}
