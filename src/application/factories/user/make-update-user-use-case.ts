import { UpdateUserUseCase } from "@/application/use-cases/user/update-user-use-case";
import { PrismaUserRepository } from "@/infra/database/prisma/repositories/prisma-users-repository";

export function makeUpdateUser() {
    const userRepository = new PrismaUserRepository();
    const updateUserUseCase = new UpdateUserUseCase(userRepository);

    return updateUserUseCase;
}
