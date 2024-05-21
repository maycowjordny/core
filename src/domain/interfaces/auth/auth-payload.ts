import { UserRoleEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { JwtPayload } from "jsonwebtoken";

export interface AuthPayload extends JwtPayload {
    sub?: string;
    companyId?: string;
    email?: string;
    name?: string;
    roles?: UserRoleEnum;
    type?: UserTypesEnum;
    iat?: number;
    exp?: number;
}
