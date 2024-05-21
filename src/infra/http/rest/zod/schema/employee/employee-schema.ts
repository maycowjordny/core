import { AccessMethodEnum, GenderEnum } from "@/domain/enum/employee-enum";
import { z } from "zod";
import { userBodySchema } from "../user/user-schema";

const genderEnumValues = Object.values(GenderEnum) as [GenderEnum];
const acessMethodEnumValues = Object.values(AccessMethodEnum) as [AccessMethodEnum];

export const employeeBodySchema = z.object({
    gender: z.enum(genderEnumValues),
    user: userBodySchema,
    phone: z.string().min(8),
    registerCode: z.string(),
    codWorkPeriod: z.string().uuid().optional(),
    hourlyWage: z.number(),
    birthDate: z.string(),
    document: z.string(),
    accessMethod: z.enum(acessMethodEnumValues),
    initialDate: z.string(),
    admissionDate: z.string(),
    presence: z.boolean().default(true),
    office: z.string(),
});
