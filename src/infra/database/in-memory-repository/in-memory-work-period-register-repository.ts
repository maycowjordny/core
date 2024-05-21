import { WorkPeriodRegister } from "@/domain/entities/work-period-register-entity";
import { UpdateWorkPeriodRegisterProps, findByEmployeeAndTimeWindowRequest } from "@/domain/interfaces/work-period-register";
import { WorkPeriodRegisterRepository } from "../repositories/work-period-register-repository";

export class InMemoryWorkPeriodRegisterRepository implements WorkPeriodRegisterRepository {
    public items: Array<WorkPeriodRegister> = [];

    async findByEmployeeAndTimeWindow({ employeeId, startDate, endDate }: findByEmployeeAndTimeWindowRequest): Promise<WorkPeriodRegister[]> {
        const result = this.items.filter((item) =>
            item.employeeId === employeeId
            && item.createdAt! >= startDate!
            && item.createdAt! <= endDate!);

        return result;
    }

    async create(workPeriodRegister: WorkPeriodRegister): Promise<WorkPeriodRegister> {
        this.items.push(workPeriodRegister);

        return workPeriodRegister;
    }

    async update(data: UpdateWorkPeriodRegisterProps): Promise<WorkPeriodRegister> {
        const result = this.items.filter(item => item.id == data.id)[0];

        const newResult = new WorkPeriodRegister({
            ...result,
            startWorkHour: data.startWorkHour,
            employeeId: data.employeeId,
            finishedBreakHour: data.finishedBreakHour,
            finishedWorkHour: data.finishedWorkHour,
            startBreakHour: data.startBreakHour,
            lat: data.lat,
            lng: data.lng,
        });

        return newResult;
    }
}
