import { WorkPeriodRegister } from "@/domain/entities/work-period-register-entity";
import { WorkPeriods } from "@/domain/interfaces/work-period";
import { GetHoursWorkedException } from "./errors/get-worked-exception";

export class GetHoursWorkedUseCase {
    execute(workPeriod: WorkPeriods | WorkPeriodRegister): number {

        const { startBreak, startWork, finishedWork, finishedBreak } = this.getTimeInMiliseconds(workPeriod);

        if (this.hasInvalidDates(workPeriod)) throw new GetHoursWorkedException();

        const workPeriodMorning = startBreak - startWork;
        const workPeriodAfternoon = finishedWork - finishedBreak;

        const workPeriodInSeconds = this.convertInSeconds(workPeriodMorning, workPeriodAfternoon);

        return workPeriodInSeconds.morning + workPeriodInSeconds.afternoon;
    }

    private convertInSeconds(workPeriodMorning: number, workPeriodAfternoon: number) {
        return {
            morning: Math.floor(workPeriodMorning / 1000),
            afternoon: Math.floor(workPeriodAfternoon / 1000)
        };
    }

    private getTimeInMiliseconds(workPeriod: WorkPeriods | WorkPeriodRegister) {
        return {
            startWork: workPeriod.startWorkHour.getTime(),
            startBreak: workPeriod.startBreakHour!.getTime(),
            finishedBreak: workPeriod.finishedBreakHour!.getTime(),
            finishedWork: workPeriod.finishedWorkHour!.getTime(),
        };
    }

    private hasInvalidDates(workPeriod: WorkPeriods | WorkPeriodRegister): boolean {
        return (
            isNaN(workPeriod.startWorkHour.getTime()) ||
            isNaN(workPeriod.startBreakHour!.getTime()) ||
            isNaN(workPeriod.finishedBreakHour!.getTime()) ||
            isNaN(workPeriod.finishedWorkHour!.getTime())
        );
    }
}
