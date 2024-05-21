import { env } from "@/config/env";
import { User } from "@/domain/entities/user-entity";
import { UserRepository } from "@/infra/database/repositories/users-repository";
import { sign } from "jsonwebtoken";
import { SendEmailUseCase } from "../auth/email/send-email-use-case";
import { ForgotPasswordException } from "./errors/forgot-password-exception";

export class ForgotPasswordUseCase {
    constructor(
        private usersRepository: UserRepository,
        private sendEmailUseCase: SendEmailUseCase
    ) { }

    async execute(email: string): Promise<string | void> {
        try {

            const user = await this.usersRepository.findByEmail(email);

            if (!user) return "A password reset email has been sent, please check your inbox.";

            const token = sign({ email: user.email }, env.JWT_RESET_PASSWORD_SECRET, {
                expiresIn: env.EXPIRES_IN_RESET_PASSWORD,
            });

            const userWithToken = new User({
                ...user.props,
                resetToken: token
            });

            const resetPasswordUrl = `${env.APP_URL}/reset-password/${email}/${token}`;

            await this.sendEmailUseCase.execute(userWithToken, {
                subject: "Link de redefinição de senha",
                html: `
                <h1>Olá ${userWithToken.name},</h1>
                <p>Para redefinir sua senha, clique no link abaixo:</p>
                <a href="${resetPasswordUrl}">Redefinir Senha</a>
                <p>Se você não solicitou a redefinição de senha, ignore este email.</p>
                `
            });

        } catch (err: any) {
            throw new ForgotPasswordException(err);
        }

    }
}

