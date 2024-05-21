import { WorkPeriodRegister } from "@/domain/entities/work-period-register-entity";
import { GetDaysOffAndDaysWorkedProps } from "@/domain/interfaces/get-days-off-and-days-worked";
import { WorkPeriods } from "@/domain/interfaces/work-period";
import { holidays } from "@/utils/holidays";
import { eachDayOfInterval, isSameDay, isSameMonth, isSunday } from "date-fns";

export class GetDaysOffAndDaysWorkedUseCase {
    async execute(workPeriods: WorkPeriods[] | WorkPeriodRegister[]): Promise<GetDaysOffAndDaysWorkedProps> {
        const workPeriod = workPeriods.map(w => w.startWorkHour);

        const firstDayOfMonth = new Date(workPeriod[0].getFullYear(), workPeriod[0].getMonth(), 1);
        const lastDayOfMonth = new Date(workPeriod[0].getFullYear(), workPeriod[0].getMonth() + 1, 0);

        const allDaysOfMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

        const dayOffs: Date[] = allDaysOfMonth.filter(day => {
            if (isSunday(day)) {
                const isHoliday = holidays.some(holiday => isSameDay(holiday.date, day));
                return !isHoliday;
            }
            return false;
        });

        const workingDays: Date[] = allDaysOfMonth.filter(day => !isSunday(day));

        holidays.forEach(holiday => {
            if (isSameMonth(holiday.date, lastDayOfMonth)) {
                dayOffs.push(holiday.date);

                const index = workingDays.findIndex(day => isSameDay(day, holiday.date));

                if (index !== -1) workingDays.splice(index, 1);
            }
        });

        return { totalDayOffs: dayOffs, totalWorkingDays: workingDays };
    }
}
