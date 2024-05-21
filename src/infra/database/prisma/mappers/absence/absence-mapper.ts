import { Absence } from "@/domain/entities/absence-entity";
import { TypeAbsenceEnum } from "@/domain/enum/absence-enum";
import { Absence as RawAbsence } from "@prisma/client";

export class AbsenceMapper {
    static toDomain(raw: RawAbsence): Absence {
        return new Absence({
            id: raw.id,
            description: raw.description,
            employeeId: raw.employeeId,
            companyId: raw.companyId,
            initialDate: raw.initialDate,
            endDate: raw.endDate,
            type: TypeAbsenceEnum[raw.type],
        });
    }
}

