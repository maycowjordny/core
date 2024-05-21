import { User as UserModel } from "@/domain/entities/user-entity";
import { Prisma } from "@prisma/client";
import { UserMapper } from "./user-mapper";

export class CreateUserMapper extends UserMapper {
    static convertToPrisma(data: UserModel): Prisma.UserCreateInput {
        return {
            name: data.name,
            email: data.email,
            company: { connect: { id: data.companyId } },
            confirmationCode: data.confirmationCode,
            resetToken: data.resetToken,
            status: data.status,
            password: data.password,
            type: data.type,
            role: data.role,
        };
    }
}

