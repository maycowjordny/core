import { User } from "@/domain/entities/user-entity";
import { AuthResetToken } from "@/domain/interfaces/auth/auh-reset-token";
import { AuthConfirmationCode } from "@/domain/interfaces/auth/auth-confirmation-code";
import { UpdateUserProps } from "@/domain/interfaces/user";
import { prisma } from "../../lib/prisma";
import { UserRepository } from "../../repositories/users-repository";
import { CreateUserMapper } from "../mappers/user/create-user-mapper";
import { UpdateUserMapper } from "../mappers/user/update-user-mapper";
import { UserMapper } from "../mappers/user/user-mapper";

export class PrismaUserRepository implements UserRepository {
    async create(user: User): Promise<User> {
        const result = await prisma.user.create({
            data: CreateUserMapper.convertToPrisma(user),
        });

        return UserMapper.toDomain(result);
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        return user && UserMapper.toDomain(user);
    }

    async update(user: UpdateUserProps): Promise<User> {
        const result = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: UpdateUserMapper.convertToPrisma(user),
        });

        return UserMapper.toDomain(result);
    }

    async findByEmailAndConfirmationCode({ email, confirmationCode }: AuthConfirmationCode): Promise<User | null> {
        const user = await prisma.user.findFirst({
            where: {
                email,
                confirmationCode
            }
        });

        return user && UserMapper.toDomain(user);
    }

    async findByEmailAndResetToken({ email, resetToken }: AuthResetToken): Promise<User | null> {
        const user = await prisma.user.findFirst({
            where: {
                email,
                resetToken
            }
        });

        return user && UserMapper.toDomain(user);
    }
}
