import { env } from "@/config/env";
import { ResetPassword, UpdateUserProps } from "@/domain/interfaces/user";
import { UserRepository } from "@/infra/database/repositories/users-repository";
import { formatToken } from "@/utils/format-token";
import { hashPassword } from "@/utils/generate-hash";
import { verify } from "jsonwebtoken";
import { ResetPasswordException } from "./errors/reset-password-exception";
import { UserNotFoundException } from "./errors/user-not-found-exception";

export class ResetPasswordUseCase {
    constructor(private usersRepository: UserRepository) { }

    async execute({ email, token, newPassword }: ResetPassword): Promise<void> {
        try {
            const user = await this.usersRepository.findByEmailAndResetToken({ email, resetToken: token });

            if (!user) throw new UserNotFoundException();

            verify(formatToken(token), env.JWT_RESET_PASSWORD_SECRET);

            const userWithNewPassword: UpdateUserProps = {
                id: user.id!,
                ...user.props,
                password: await hashPassword(newPassword),
                resetToken: null,
            };

            await this.usersRepository.update(userWithNewPassword);

        } catch (err: any) {
            if (err instanceof UserNotFoundException) {
                throw new UserNotFoundException();
            }
            throw new ResetPasswordException(err);
        }

    }
}
