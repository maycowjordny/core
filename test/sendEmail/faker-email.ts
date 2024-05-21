import { SendEmailException } from "@/application/use-cases/auth/errors/generate-code-exception";
import { env } from "@/config/env";
import { User } from "@/domain/entities/user-entity";
import { EmailConfig } from "@/domain/interfaces/email";
import nodemailer from "nodemailer";
import nodemailerStubTransport from "nodemailer-stub-transport";

export class SendEmailFaker {
    async execute(user: User, emailConfig: EmailConfig): Promise<void> {
        const smtp = nodemailer.createTransport(nodemailerStubTransport());

        try {
            const configEmail = {
                from: {
                    name: "Ponto Ágil",
                    address: env.AUTH_USER_NODEMAILER,
                },
                to: user.email,
                subject: emailConfig.subject,
                html: emailConfig.html
            };

            await smtp.sendMail(configEmail);
        } catch (err: any) {
            throw new SendEmailException(err);
        }
    }
}
