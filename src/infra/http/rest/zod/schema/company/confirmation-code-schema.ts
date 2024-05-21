import { z } from "zod";

export const confirmationCodeSchema = z.object({
    confirmationCode: z.string().min(6),
    email: z.string().email()
});
