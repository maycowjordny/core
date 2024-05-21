import { Entity } from "@/core/domain/entities/entity";
import { Replace } from "@/core/logic/replace";
import { AccessMethodEnum } from "../enum/employee-enum";
import { User } from "./user-entity";

export type EmployeeProps = {
    id?: string;
    user?: User;
    companyId: string;
    codWorkPeriod?: string
    gender: string;
    phone: string;
    isActive: boolean
    nisPis?: string | null,
    registerCode: string;
    hourlyWage: number;
    birthDate: string;
    document: string;
    accessMethod: AccessMethodEnum;
    initialDate: string;
    admissionDate: string;
    presence: boolean;
    office: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export class Employee extends Entity<EmployeeProps> {
    get id() {
        return this.props.id;
    }

    get codWorkPeriod() {
        return this.props.codWorkPeriod;
    }

    get user() {
        return this.props.user;
    }

    get companyId() {
        return this.props.companyId;
    }

    get gender() {
        return this.props.gender;
    }

    get nisPis() {
        return this.props.nisPis;
    }

    get isActive() {
        return this.props.isActive;
    }

    get document() {
        return this.props.document;
    }

    get registerCode() {
        return this.props.registerCode;
    }

    get phone() {
        return this.props.phone;
    }

    get admissionDate() {
        return this.props.admissionDate;
    }

    get birthDate() {
        return this.props.birthDate;
    }

    get presence() {
        return this.props.presence;
    }

    get hourlyWage() {
        return this.props.hourlyWage;
    }

    get accessMethod() {
        return this.props.accessMethod;
    }

    get initialDate() {
        return this.props.initialDate;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }
    get office() {
        return this.props.office;
    }

    static create(
        props: Replace<
            EmployeeProps,
            {
                createdAt?: Date;
            }
        >
    ) {
        const employee = new Employee({
            ...props,
        });

        return employee;
    }
}
