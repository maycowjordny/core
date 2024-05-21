import { WeekdayEnum } from "@/domain/enum/week-day-enum";
import { z } from "zod";

const weekDayEnumValues = Object.values(WeekdayEnum) as [WeekdayEnum];

export const workPeriodUpdateSchema = z.object({
    workPeriod: z.object({
        workPeriods: z.array(
            z.object({
                day: z.enum(weekDayEnumValues),
                name: z.string(),
                startWorkHour: z.string().transform(value => new Date(value)),
                finishedWorkHour: z.string().transform(value => new Date(value)),
                startBreakHour: z.string().transform(value => new Date(value)),
                finishedBreakHour: z.string().transform(value => new Date(value)),
            })
        )
    })
});

