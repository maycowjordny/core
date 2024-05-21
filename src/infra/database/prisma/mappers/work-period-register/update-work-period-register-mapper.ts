import { UpdateWorkPeriodRegisterProps } from "@/domain/interfaces/work-period-register";
import { Prisma } from "@prisma/client";
import { WorkPeriodRegisterMapper } from "./work-period-register-mapper";

export class UpdateWorkPeriodRegisterMapper extends WorkPeriodRegisterMapper {
    static convertToPrisma(workPeriodRegister: UpdateWorkPeriodRegisterProps): Prisma.WorkPeriodRegisterUncheckedUpdateInput {
        return {
            lat: workPeriodRegister.lat,
            lng: workPeriodRegister.lng,
            startWorkHour: workPeriodRegister.startWorkHour,
            startBreakHour: workPeriodRegister.startBreakHour,
            finishedBreakHour: workPeriodRegister.finishedBreakHour,
            finishedWorkHour: workPeriodRegister.finishedWorkHour
        };
    }
}
