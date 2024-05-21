import { GenerateJwtUseCase } from "@/application/use-cases/auth/generate-jwt-use-case";
import { ValidateCodeConfirmationUseCase } from "@/application/use-cases/user/validate-confirmation-code-use-case";
import { PrismaUserRepository } from "@/infra/database/prisma/repositories/prisma-users-repository";

export function makeValidadeConfirmationCode() {
    const userRepository = new PrismaUserRepository();
    const generateJwtUseCase = new GenerateJwtUseCase();
    const validadeConfirmationCodeUseCase = new ValidateCodeConfirmationUseCase(userRepository, generateJwtUseCase);

    return validadeConfirmationCodeUseCase;
}
