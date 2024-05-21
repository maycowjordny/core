import { UserStatusEnum } from "../enum/user-enum";

export interface UpdateUserProps {
    id: string
    name: string;
    email: string;
    password: string;
    status?: UserStatusEnum
    resetToken?: string | null
}

export interface ResetPassword {
    token: string;
    email: string;
    newPassword: string;
}
