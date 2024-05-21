/* eslint-disable indent */

import { WeekdayEnum } from "@/domain/enum/week-day-enum";

export function dayOfWeek(day: number) {
    switch (day) {
        case 0:
            return WeekdayEnum.Sunday;
        case 1:
            return WeekdayEnum.Monday;
        case 2:
            return WeekdayEnum.Tuesday;
        case 3:
            return WeekdayEnum.Wednesday;
        case 4:
            return WeekdayEnum.Thursday;
        case 5:
            return WeekdayEnum.Friday;
        case 6:
            return WeekdayEnum.Saturday;
        default:
            throw new Error("Invalid day value");
    }
}
