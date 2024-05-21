import { AccessMethodEnum, GenderEnum } from "@/domain/enum/employee-enum";
import { z } from "zod";

const genderEnumValues = Object.values(GenderEnum) as [GenderEnum];
const acessMethodEnumValues = Object.values(AccessMethodEnum) as [AccessMethodEnum];

export const employeeUpdateSchema = z.object({
    gender: z.enum(genderEnumValues),
    phone: z.string().min(8),
    registerCode: z.string(),
    isActive: z.boolean(),
    hourlyWage: z.number(),
    birthDate: z.string(),
    document: z.string(),
    accessMethod: z.enum(acessMethodEnumValues),
    initialDate: z.string(),
    admissionDate: z.string(),
    presence: z.boolean().default(true),
    office: z.string(),
});
