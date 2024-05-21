import { Absence } from "@/domain/entities/absence-entity";
import { TypeAbsenceEnum } from "@/domain/enum/absence-enum";
import { AbsenceType, Prisma } from "@prisma/client";
import { AbsenceMapper } from "./absence-mapper";

export class CreateAbsenceMapper extends AbsenceMapper {
    static convertToPrisma(absence: Absence): Prisma.AbsenceCreateInput {
        return {
            description: absence.description,
            employee: { connect: { id: absence.employeeId } },
            company: { connect: { id: absence.companyId } },
            initialDate: absence.initialDate,
            endDate: absence.endDate,
            type: TypeAbsenceEnum[absence.type] as AbsenceType,
        };
    }
}

