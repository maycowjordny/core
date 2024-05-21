import { Entity } from "@/core/domain/entities/entity";
import { Replace } from "@/core/logic/replace";
import { Address } from "./address-entity";
import { User } from "./user-entity";

export type CompanyProps = {
    id?: string;
    user?: User
    address: Address;
    categoryId: string;
    socialName: string;
    document: string;
    phone: string;
    employeeQuantity: number;
    createdAt?: Date;
    updatedAt?: Date;
};

export class Company extends Entity<CompanyProps> {
    get id() {
        return this.props.id;
    }

    get user() {
        return this.props.user;
    }

    get categoryId() {
        return this.props.categoryId;
    }

    get address() {
        return this.props.address;
    }

    get document() {
        return this.props.document;
    }

    get phone() {
        return this.props.phone;
    }

    get socialName() {
        return this.props.socialName;
    }

    get employeeQuantity() {
        return this.props.employeeQuantity;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    static create(
        props: Replace<
            CompanyProps,
            {
                createdAt?: Date;
            }
        >
    ) {
        const company = new Company({
            ...props,
        });

        return company;
    }
}
