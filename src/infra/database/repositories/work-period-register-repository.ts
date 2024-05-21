import { WorkPeriodRegister } from "@/domain/entities/work-period-register-entity";
import { UpdateWorkPeriodRegisterProps, findByEmployeeAndTimeWindowRequest } from "@/domain/interfaces/work-period-register";

export interface WorkPeriodRegisterRepository {
  create(workPeriodRegister: WorkPeriodRegister): Promise<WorkPeriodRegister>;
  findByEmployeeAndTimeWindow({ employeeId, startDate, endDate }: findByEmployeeAndTimeWindowRequest): Promise<WorkPeriodRegister[]>;
  update(data: UpdateWorkPeriodRegisterProps): Promise<WorkPeriodRegister>;
}
