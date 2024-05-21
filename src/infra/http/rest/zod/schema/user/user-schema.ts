import { z } from "zod";

export const userBodySchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[`~<>?,./!@#$%^&*()\-_+="|{}[\];:]).{6,}$/)
});

