import { Entity } from "@/core/domain/entities/entity";
import { Replace } from "@/core/logic/replace";

export type ExtraWorkPeriodProps = {
  id?: string;
  workPeriodId?: string;
  employeeId?: string;
  startExtraWorkHour: Date;
  finishedExtraWorkHour: Date;
  startExtraBreakHour: Date;
  finishedExtraBreakHour: Date;
  lat: string;
  lng: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class ExtraWorkPeriod extends Entity<ExtraWorkPeriodProps> {
    get id() {
        return this.props.id;
    }

    get workPeriodId() {
        return this.props.workPeriodId;
    }

    get employeeId() {
        return this.props.employeeId;
    }

    get startExtraWorkHour() {
        return this.props.startExtraWorkHour;
    }

    get lat() {
        return this.props.lat;
    }

    get startExtraBreakHour() {
        return this.props.startExtraBreakHour;
    }

    get finishedExtraBreakHour() {
        return this.props.finishedExtraBreakHour;
    }

    get lng() {
        return this.props.lng;
    }

    get finishedExtraWorkHour() {
        return this.props.finishedExtraWorkHour;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    static create(
        props: Replace<
      ExtraWorkPeriodProps,
      {
        createdAt?: Date;
      }
    >
    ) {
        const extraWorkPeriod = new ExtraWorkPeriod({
            ...props,
        });

        return extraWorkPeriod;
    }
}
