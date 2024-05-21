import { WorkPeriod } from "../entities/work-period-entity";
import { WeekdayEnum } from "../enum/week-day-enum";
import { EmployeeWithHours } from "./employee";
import { Pagination } from "./pagination";

export interface WorkPeriodRequest {
  employeeId?: string;
  companyId: string;
  pagination: Pagination;
}

export interface WorkPeriods {
  day: WeekdayEnum
  name: string;
  startWorkHour: Date;
  finishedWorkHour: Date;
  startBreakHour: Date;
  finishedBreakHour: Date;
}

export interface WorkPeriodsPersistence {
  id: string;
  codWorkPeriod: string;
  companyId: string
  createdAt: Date;
  updatedAt: Date;
  day: WeekdayEnum
  name: string;
  startWorkHour: Date;
  finishedWorkHour: Date;
  startBreakHour: Date;
  finishedBreakHour: Date;
}

export interface WorkPeriodWithEmployee {
  workperiod: WorkPeriod;
  employee?: EmployeeWithHours;
}

export interface WorkHoursProps {
  startWorkHour: Date;
  finishedWorkHour: Date;
  startBreakHour: Date;
  finishedBreakHour: Date;
}

export interface CalculateWorkPeriodResponse {
  workPeriodHoursInSeconds: number;
  workPeriod: WorkPeriodWithEmployee;
}

export interface UpdateWorkPeriodProps {
  companyId: string
  name?: string
  codWorkPeriod: string
  workPeriods: WorkPeriods[]
  startWorkHour?: Date;
  finishedWorkHour?: Date;
  startBreakHour?: Date;
  finishedBreakHour?: Date;
}

