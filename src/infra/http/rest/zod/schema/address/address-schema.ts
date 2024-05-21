import { z } from "zod";

export const addressBodySchema = z.object({
    lat: z.string(),
    lng: z.string(),
    description: z.string(),
});
