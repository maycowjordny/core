import { makeTimeTrackException } from "@/application/errors/make-time-track-exception";
import { WorkPeriod } from "@/domain/entities/work-period-entity";
import { WorkPeriodRegister } from "@/domain/entities/work-period-register-entity";
import { TypeAbsenceEnum } from "@/domain/enum/absence-enum";
import { CalculateWorkingDaysWithValidAbsencesProps } from "@/domain/interfaces/make-time-track";
import { CalculateWorkPeriodRegisterResponse, findByEmployeeAndTimeWindowRequest } from "@/domain/interfaces/work-period-register";
import { holidays } from "@/utils/holidays";
import { isSameDay } from "date-fns";
import { FindManyAbsenceByEmployeeIdUseCase } from "../absence/find-many-absence-by-employee-id";
import { GetDaysOffAndDaysWorkedUseCase } from "../days-off-and-days-worked/get-days-off-and-days-worked";
import { EmployeeNotFoundException } from "../employee/errors/not-found-employee-exception";
import { FindEmployeeByIdUseCase } from "../employee/find-employee-by-id-use-case";
import { GetHoursWorkedUseCase } from "../get-worked/get-hours-worked-use-case";
import { FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase } from "../work-period-register/find-workperiod-register-by-employee-id-window";
import { WorkPeriodNotFoundException } from "../work-period/errors/work-period-not-found-exception";
import { FindWorkPeriodByCodWorkPeriodUseCase } from "../work-period/find-workperiod-by-code-work-period";

export class MakeTimeTrackEmployeeMonthlyUseCase {
    constructor(
        private findEmployeeByIdUseCase: FindEmployeeByIdUseCase,
        private findWorkPeriodRegisterByEmployeeIdWindow: FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase,
        private findWorkPeriodByCodWorkPeriodUseCase: FindWorkPeriodByCodWorkPeriodUseCase,
        private findAbsenceByEmployeeIdUseCase: FindManyAbsenceByEmployeeIdUseCase,
        private getWorkedHoursUseCase: GetHoursWorkedUseCase,
        private getDaysOffAndDaysWorkedUseCase: GetDaysOffAndDaysWorkedUseCase,
    ) { }

    private totalWorkedSecconds: number = 0;
    private totalToWorkeSecconds: number = 0;
    private missingWorkDates: Date[] = [];
    private workedOnMandatoryHolidays: Date[] = [];
    private workedOnDayOffs: Date[] = [];

    async execute({ employeeId, endDate, startDate }: findByEmployeeAndTimeWindowRequest): Promise<CalculateWorkPeriodRegisterResponse> {
        try {

            const employee = await this.findEmployeeByIdUseCase.execute(employeeId);

            if (!employee) throw new EmployeeNotFoundException();

            const workPeriods = await this.findWorkPeriodByCodWorkPeriodUseCase.execute(employee.codWorkPeriod!);

            if (!workPeriods) throw new WorkPeriodNotFoundException();

            const workPeriodRegisters = await this.findWorkPeriodRegisterByEmployeeIdWindow.execute({ employeeId, endDate, startDate });
            const absence = await this.findAbsenceByEmployeeIdUseCase.execute(employeeId);

            const workPeriodRegisterDates = workPeriodRegisters!.map(workPeriodRegister => workPeriodRegister.startWorkHour);
            const workPeriodDates = workPeriods.workPeriods.map(workPeriod => workPeriod.startWorkHour);

            const absenceType = absence.filter(absence => absence.type);

            const { totalDayOffs, totalWorkingDays } = await this.getDaysOffAndDaysWorkedUseCase.execute(workPeriods.workPeriods);

            const { absenceDays } = this.calculateWorkingDaysWithValidAbsences({
                absenceType,
                workPeriodDates,
                workPeriodRegisterDates
            });

            const workedOnDayOffs = this.isWorkOnDayOff(workPeriodRegisterDates, totalDayOffs);

            const workedOnMandatoryHolidays = this.isWorkOnMandatoryHoliday(workPeriodRegisterDates);

            return {
                employee: {
                    id: employee.id!,
                    hourlyWage: employee.hourlyWage,
                },
                absenceDays: absenceDays.length,
                totalDayOffs: totalDayOffs.length - workedOnDayOffs.length,
                totalWorkingDays: totalWorkingDays.length + workedOnDayOffs.length - workedOnMandatoryHolidays.length,
                workedOnMandatoryHolidays: workedOnMandatoryHolidays.length,
                totalWorkedInSeconds: this.getTotalWorkedInSeconds(workPeriodRegisters!),
                totalToWorkedInSeconds: this.getTotalToWorkeInSeconds(workPeriods),
            };
        } catch (err: any) {
            throw new makeTimeTrackException(err);
        }
    }

    private isWorkOnMandatoryHoliday(workPeriodRegisterDates: Date[]) {
        holidays.map(holiday => {
            const mandatoryHoliday = workPeriodRegisterDates.filter(workPeriodRegister => isSameDay(holiday.date, workPeriodRegister) && holiday.isOptional == true)[0];

            return mandatoryHoliday ? this.workedOnMandatoryHolidays.push(mandatoryHoliday) : 0;
        });

        return this.workedOnMandatoryHolidays;
    }

    private isWorkOnDayOff(workPeriodRegisterDates: Date[], totalDayOffs: Date[]) {
        workPeriodRegisterDates.map(workPeriodRegister => {
            const workDay = totalDayOffs.filter(dayOff => isSameDay(dayOff, workPeriodRegister))[0];

            return workDay ? this.workedOnDayOffs.push(workDay) : 0;
        });

        return this.workedOnDayOffs;
    }

    private calculateWorkingDaysWithValidAbsences(props: CalculateWorkingDaysWithValidAbsencesProps) {
        const { absenceType, workPeriodDates, workPeriodRegisterDates } = props;

        absenceType.forEach(absence => {
            if (absence.type === TypeAbsenceEnum.UNJUSTIFIED) {
                this.missingWorkDates = this.missingDates(workPeriodDates, workPeriodRegisterDates);

            }
        });

        return { absenceDays: this.missingWorkDates };
    }

    private missingDates(workPeriodDates: Date[], workPeriodRegisterDates: Date[]) {
        return workPeriodDates.filter(workDate => this.compareDatesAndGetMissingDate(workPeriodRegisterDates, workDate));
    }

    private compareDatesAndGetMissingDate(workPeriodRegisterDates: Date[], workDate: Date) {
        return !workPeriodRegisterDates.some(registerDate => isSameDay(workDate, registerDate));
    }

    private getTotalWorkedInSeconds(workPeriodRegisters: WorkPeriodRegister[]) {
        workPeriodRegisters.map(workPeriodRegister => {
            this.totalWorkedSecconds += this.getWorkedHoursUseCase.execute(workPeriodRegister);
        });

        return this.totalWorkedSecconds;
    }

    private getTotalToWorkeInSeconds(workPeriods: WorkPeriod) {
        workPeriods.workPeriods.map(workPeriod => {
            this.totalToWorkeSecconds += this.getWorkedHoursUseCase.execute(workPeriod);
        });

        return this.totalToWorkeSecconds;
    }
}
