import { Absence } from "@/domain/entities/absence-entity";
import { Prisma } from "@prisma/client";
import { AbsenceMapper } from "./absence-mapper";

export class UpdateAbsenceMapper extends AbsenceMapper {
    static convertToPrisma(absence: Absence): Prisma.AbsenceUncheckedUpdateInput {
        return {
            description: absence.description,
            initialDate: absence.initialDate,
            type: absence.type,
            employeeId: absence.employeeId,
        };
    }
}
