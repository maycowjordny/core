import { WorkPeriodRegister } from "@/domain/entities/work-period-register-entity";
import { Prisma } from "@prisma/client";
import { WorkPeriodRegisterMapper } from "./work-period-register-mapper";

export class CreateWorkPeriodRegister extends WorkPeriodRegisterMapper {
    static convertToPrisma(workPeriodRegister: WorkPeriodRegister): Prisma.WorkPeriodRegisterCreateInput {
        const prismaInput: Prisma.WorkPeriodRegisterCreateInput = {
            employee: { connect: { id: workPeriodRegister.employeeId! } },
            workPeriod: workPeriodRegister.workPeriodId ? { connect: { id: workPeriodRegister.workPeriodId } } : undefined,
            startWorkHour: new Date(workPeriodRegister.startWorkHour),
            startBreakHour: new Date(workPeriodRegister.startBreakHour!),
            finishedBreakHour: new Date(workPeriodRegister.finishedBreakHour!),
            finishedWorkHour: new Date(workPeriodRegister.finishedWorkHour!),
            lat: workPeriodRegister.lat,
            lng: workPeriodRegister.lng,
        };

        return prismaInput;
    }
}
