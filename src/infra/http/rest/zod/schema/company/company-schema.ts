import { z } from "zod";
import { addressBodySchema } from "../address/address-schema";
import { userBodySchema } from "../user/user-schema";

export const companyBodySchema = z.object({
    user: userBodySchema,
    address: addressBodySchema,
    categoryId: z.string().uuid(),
    socialName: z.string(),
    document: z.string(),
    phone: z.string(),
    employeeQuantity: z.number(),
});
