import { z } from "zod";

export const rersetPasswordBodySchema = z.object({
    email: z.string().email(),
    token: z.string(),
    newPassword: z.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[`~<>?,./!@#$%^&*()\-_+="|{}[\];:]).{6,}$/)
});

