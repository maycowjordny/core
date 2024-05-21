import { Entity } from "@/core/domain/entities/entity";
import { Replace } from "@/core/logic/replace";

export type WorkPeriodRegisterProps = {
    id?: string;
    workPeriodId?: string
    employeeId: string;
    startWorkHour: Date;
    finishedWorkHour?: Date | null;
    startBreakHour?: Date | null;
    finishedBreakHour?: Date | null;
    lat: string;
    lng: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export class WorkPeriodRegister extends Entity<WorkPeriodRegisterProps> {
    get id() {
        return this.props.id;
    }

    get workPeriodId() {
        return this.props.workPeriodId;
    }

    get employeeId() {
        return this.props.employeeId;
    }

    get startWorkHour() {
        return this.props.startWorkHour;
    }

    get lat() {
        return this.props.lat;
    }

    get lng() {
        return this.props.lng;
    }

    get finishedWorkHour() {
        return this.props.finishedWorkHour;
    }

    get startBreakHour() {
        return this.props.startBreakHour;
    }

    get finishedBreakHour() {
        return this.props.finishedBreakHour;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    static create(
        props: Replace<
            WorkPeriodRegisterProps,
            {
                createdAt?: Date;
            }
        >
    ) {
        const workPeriodRegister = new WorkPeriodRegister({
            ...props,
        });

        return workPeriodRegister;
    }
}
