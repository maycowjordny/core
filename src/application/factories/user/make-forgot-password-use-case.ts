import { SendEmailUseCase } from "@/application/use-cases/auth/email/send-email-use-case";
import { ForgotPasswordUseCase } from "@/application/use-cases/user/forgot-password-use-case";
import { PrismaUserRepository } from "@/infra/database/prisma/repositories/prisma-users-repository";

export function makeForgotPassword() {
    const userRepository = new PrismaUserRepository();
    const sendEmailUseCase = new SendEmailUseCase();
    const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, sendEmailUseCase);

    return forgotPasswordUseCase;
}
