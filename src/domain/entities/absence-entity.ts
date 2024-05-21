import { Entity } from "@/core/domain/entities/entity";
import { Replace } from "@/core/logic/replace";
import { TypeAbsenceEnum } from "../enum/absence-enum";

export type AbsenceProps = {
    id?: string;
    employeeId: string;
    companyId: string;
    type: TypeAbsenceEnum;
    description: string;
    initialDate: Date | string;
    endDate: Date | string;
    createdAt?: Date;
    updatedAt?: Date;
};

export class Absence extends Entity<AbsenceProps> {
    get id() {
        return this.props.id;
    }

    get employeeId() {
        return this.props.employeeId;
    }

    get companyId() {
        return this.props.companyId;
    }

    get type() {
        return this.props.type;
    }

    get description() {
        return this.props.description;
    }

    get initialDate() {
        return this.props.initialDate;
    }

    get endDate() {
        return this.props.endDate;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    static create(
        props: Replace<
            AbsenceProps,
            {
                createdAt?: Date;
            }
        >
    ) {
        const absence = new Absence({
            ...props,
        });

        return absence;
    }
}
