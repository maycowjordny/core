import { Entity } from "@/core/domain/entities/entity";
import { Replace } from "@/core/logic/replace";
import { UserRoleEnum, UserStatusEnum, UserTypesEnum } from "../enum/user-enum";

export type UserProps = {
    id?: string;
    companyId?: string;
    name: string;
    password: string;
    email: string;
    status: UserStatusEnum;
    resetToken?: string;
    confirmationCode?: string;
    role: UserRoleEnum;
    type: UserTypesEnum;
    createdAt?: Date;
    updatedAt?: Date;
};

export class User extends Entity<UserProps> {
    get id() {
        return this.props.id;
    }

    get companyId() {
        return this.props.companyId;
    }

    get name() {
        return this.props.name;
    }

    get email() {
        return this.props.email;
    }

    get password() {
        return this.props.password;
    }

    get role() {
        return this.props.role;
    }

    get confirmationCode() {
        return this.props.confirmationCode;
    }

    get resetToken() {
        return this.props.resetToken;
    }

    get status() {
        return this.props.status;
    }

    get type() {
        return this.props.type;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    static create(
        props: Replace<
            UserProps,
            {
                createdAt?: Date;
            }
        >
    ) {
        const user = new User({
            ...props,
        });

        return user;
    }
}
