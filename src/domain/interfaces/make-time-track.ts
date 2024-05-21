import { Absence } from "../entities/absence-entity";

export interface CalculateWorkingDaysWithValidAbsencesProps {
    absenceType: Absence[];
    workPeriodDates: Date[];
    workPeriodRegisterDates: Date[];
}
