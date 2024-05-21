import { WorkPeriodRegister } from "@/domain/entities/work-period-register-entity";
import { WorkPeriodRegister as RawWorkPeriodRegister } from "@prisma/client";

export class WorkPeriodRegisterMapper {
    static toDomain(raw: RawWorkPeriodRegister): WorkPeriodRegister {
        return new WorkPeriodRegister({
            id: raw.id,
            employeeId: raw.employeeId,
            workPeriodId: raw.workPeriodId!,
            lat: raw.lat,
            lng: raw.lng,
            startWorkHour: raw.startBreakHour!,
            finishedWorkHour: raw.finishedWorkHour!,
            finishedBreakHour: raw.finishedBreakHour!,
            startBreakHour: raw.startBreakHour!,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        });
    }
}
