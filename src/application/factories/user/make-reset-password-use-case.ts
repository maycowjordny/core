import { ResetPasswordUseCase } from "@/application/use-cases/user/reset-password-use-case";
import { PrismaUserRepository } from "@/infra/database/prisma/repositories/prisma-users-repository";

export function makeResetPassword() {
    const userRepository = new PrismaUserRepository();
    const resetPasswordUseCase = new ResetPasswordUseCase(userRepository);

    return resetPasswordUseCase;
}
