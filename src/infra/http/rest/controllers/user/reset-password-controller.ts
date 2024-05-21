import { makeResetPassword } from "@/application/factories/user/make-reset-password-use-case";
import { ResetPasswordException } from "@/application/use-cases/user/errors/reset-password-exception";
import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyRequestType } from "fastify/types/type-provider";
import { rersetPasswordBodySchema } from "../../zod/schema/user/reset-password-schema";

export class ResetPasswordController {
    public resetPassword = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { email, newPassword, token } = this.resetPasswordValidator(request.body);

            const resetPasswordUseCase = makeResetPassword();

            await resetPasswordUseCase.execute({
                email,
                newPassword,
                token
            });
            reply.status(200).send({ message: "Password update sucessfuly!" });
        } catch (err) {
            if (err instanceof ResetPasswordException) {
                reply.status(400).send({ message: err.message });
            }
            throw err;
        }
    };

    private resetPasswordValidator(body: FastifyRequestType["body"]) {
        return rersetPasswordBodySchema.parse(body);
    }

}
