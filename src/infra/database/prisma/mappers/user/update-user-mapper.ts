import { UpdateUserProps } from "@/domain/interfaces/user";
import { Prisma } from "@prisma/client";
import { UserMapper } from "./user-mapper";

export class UpdateUserMapper extends UserMapper {
    static convertToPrisma(data: UpdateUserProps): Prisma.UserUpdateInput {
        return {
            name: data.name,
            email: data.email,
            password: data.password,
            status: data.status
        };
    }
}

