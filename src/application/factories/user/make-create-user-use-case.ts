import { CreateUserUseCase } from "@/application/use-cases/user/create-user-use-case";
import { PrismaUserRepository } from "@/infra/database/prisma/repositories/prisma-users-repository";

export function makeCreateUser() {
    const userRepository = new PrismaUserRepository();
    const createUserUseCase = new CreateUserUseCase(userRepository);

    return createUserUseCase;
}
