import { z } from "zod";

export const workPeriodRegisterBodySchema = z.object({
    startWorkHour: z.string().transform(value => new Date(value)),
    finishedWorkHour: z.string().transform(value => new Date(value)).nullable(),
    startBreakHour: z.string().transform(value => new Date(value)).nullable(),
    finishedBreakHour: z.string().transform(value => new Date(value)).nullable(),
    lat: z.string(),
    lng: z.string(),
});

