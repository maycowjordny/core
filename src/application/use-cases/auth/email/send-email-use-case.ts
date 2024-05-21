/* eslint-disable indent */
import { env } from "@/config/env";
import { User } from "@/domain/entities/user-entity";
import { EmailConfig } from "@/domain/interfaces/email";
import nodemailer from "nodemailer";
import { SendEmailException } from "../errors/generate-code-exception";

const smtp = nodemailer.createTransport({
  host: env.HOST_NODEMAILER,
  port: env.PORT_NODEMAILER,
  secure: true,
  auth: {
    user: env.AUTH_USER_NODEMAILER,
    pass: env.AUTH_PASSWORD_NODEMAILER,
  },
});

export class SendEmailUseCase {
  async execute(user: User, emailConfig: EmailConfig): Promise<void> {
    try {
      const configEmail = {
        from: {
          name: "Ponto Ágil",
          address: env.AUTH_USER_NODEMAILER,
        },
        to: user.email,
        subject: emailConfig.subject,
        html: emailConfig.html,
      };

      await smtp.sendMail(configEmail);
    } catch (err: any) {
      throw new SendEmailException(err);
    }
  }
}
