import { z } from "zod";

export const employeeUpdateSchema = z.object({
    isActive: z.boolean(),
});
