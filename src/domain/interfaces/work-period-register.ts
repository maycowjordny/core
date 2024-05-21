import { EmployeeWithHours } from "./employee";

export interface CalculateWorkPeriodRegisterResponse {
  employee: EmployeeWithHours;
  totalWorkedInSeconds: number;
  totalToWorkedInSeconds?: number;
  absenceDays?: number
  totalDayOffs: number
  totalWorkingDays: number
  workedOnMandatoryHolidays?: number
}

export interface findByEmployeeAndTimeWindowRequest {
  employeeId: string;
  startDate?: Date;
  endDate?: Date;
}

export interface IsLocationNearbyProps {
  registerLocation: { latitude: number; longitude: number; },
  localizationCompany: { latitude: number; longitude: number; }
}

export interface UpdateWorkPeriodRegisterProps {
  id: string;
  lat: string;
  lng: string;
  employeeId: string;
  startWorkHour: Date;
  finishedWorkHour: Date;
  startBreakHour: Date;
  finishedBreakHour: Date;
}
