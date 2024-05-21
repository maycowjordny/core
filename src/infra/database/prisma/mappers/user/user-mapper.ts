import { User } from "@/domain/entities/user-entity";
import { UserRoleEnum, UserStatusEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { User as RawUser } from "@prisma/client";

export class UserMapper {
    static toDomain(raw: RawUser): User {
        return new User({
            id: raw.id,
            companyId: raw.companyId!,
            name: raw.name,
            email: raw.email,
            confirmationCode: raw.confirmationCode!,
            resetToken: raw.resetToken!,
            status: UserStatusEnum[raw.status],
            password: raw.password,
            type: UserTypesEnum[raw.type],
            role: UserRoleEnum[raw.role],
            createdAt: raw.createdAt,
        });
    }
}
