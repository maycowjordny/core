import { Entity } from "@/core/domain/entities/entity";
import { Replace } from "@/core/logic/replace";
import { WorkPeriods } from "../interfaces/work-period";

export type WorkPeriodProps = {
    id?: string;
    codWorkPeriod?: string;
    companyId: string;
    workPeriods: WorkPeriods[];
    createdAt?: Date;
    updatedAt?: Date;
};

export class WorkPeriod extends Entity<WorkPeriodProps> {
    get id() {
        return this.props.id;
    }

    get workPeriods() {
        return this.props.workPeriods;
    }

    get codWorkPeriod() {
        return this.props.codWorkPeriod;
    }

    get companyId() {
        return this.props.companyId;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    static create(
        props: Replace<
            WorkPeriodProps,
            {
                createdAt?: Date;
            }
        >
    ) {
        const workPeriod = new WorkPeriod({
            ...props,
        });

        return workPeriod;
    }
}
