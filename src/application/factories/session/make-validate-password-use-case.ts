import { GenerateJwtUseCase } from "@/application/use-cases/auth/generate-jwt-use-case";
import { ValidatePasswordUseCase } from "@/application/use-cases/user/validate-password-use-case";
import { PrismaUserRepository } from "@/infra/database/prisma/repositories/prisma-users-repository";

const generateJwtUseCase = new GenerateJwtUseCase();

export function makeValidadePassword() {
    const userRepository = new PrismaUserRepository();
    const passwordValidateUseCase = new ValidatePasswordUseCase(userRepository, generateJwtUseCase);

    return passwordValidateUseCase;
}
