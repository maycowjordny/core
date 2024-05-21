import { z } from "zod";

export const sessionBodySchema = z.object({
    email: z.string(),
    password: z.string().min(6),
});
