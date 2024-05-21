import { TypeAbsenceEnum } from "@/domain/enum/absence-enum";
import { z } from "zod";

const absenceTypeEnumValues = Object.values(TypeAbsenceEnum) as [TypeAbsenceEnum];

export const absenceBodySchema = z.object({
    employeeId: z.string().uuid(),
    description: z.string(),
    initialDate: z.string(),
    endDate: z.string(),
    type: z.enum(absenceTypeEnumValues),
});
