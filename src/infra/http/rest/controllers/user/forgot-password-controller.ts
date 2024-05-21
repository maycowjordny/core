import { makeForgotPassword } from "@/application/factories/user/make-forgot-password-use-case";
import { ForgotPasswordException } from "@/application/use-cases/user/errors/forgot-password-exception";
import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyRequestType } from "fastify/types/type-provider";
import { forgotPasswordBodySchema } from "../../zod/schema/user/forgot-password-schema";

export class ForgotPasswordController {
    public forgotPassword = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { email } = this.forgotPasswordValidator(request.body);

            const forgotPasswordUseCase = makeForgotPassword();

            await forgotPasswordUseCase.execute(email);

            reply.status(200).send({ message: "A password reset email has been sent, please check your inbox." });
        } catch (err) {
            if (err instanceof ForgotPasswordException) {
                reply.status(400).send({ message: err.message });
            } else {
                throw err;
            }
        }
    };

    private forgotPasswordValidator(body: FastifyRequestType["body"]) {
        return forgotPasswordBodySchema.parse(body);
    }

}
