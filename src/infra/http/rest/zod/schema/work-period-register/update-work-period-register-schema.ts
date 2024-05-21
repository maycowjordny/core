import { z } from "zod";

export const workPeriodRegisterUpdateSchema = z.object({
    startWorkHour: z.string().transform(value => new Date(value)),
    finishedWorkHour: z.string().transform(value => new Date(value)),
    startBreakHour: z.string().transform(value => new Date(value)),
    finishedBreakHour: z.string().transform(value => new Date(value)),
    lat: z.string(),
    lng: z.string(),
});

