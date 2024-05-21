import { z } from "zod";

export const categoryBodySchema = z.object({
    name: z.string(),
});
