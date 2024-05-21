import { z } from "zod";

export const companyUpdateSchema = z.object({
    categoryId: z.string().uuid(),
    socialName: z.string(),
    document: z.string(),
    phone: z.string(),
    employeeQuantity: z.number(),
});
