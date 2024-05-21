import { makeValidadePassword } from "@/application/factories/session/make-validate-password-use-case";
import { InvalidCredentialsError } from "@/application/use-cases/user/errors/invalid-credentials-error";
import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyRequestType } from "fastify/types/type-provider";
import { sessionBodySchema } from "../../zod/schema/session/session-schema";

export class SessionCreateController {
    public create = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const sessionValidator = this.sessionValidator(request.body);

            const passwordValidateUseCase = makeValidadePassword();

            const { accessToken } = await passwordValidateUseCase.execute(sessionValidator);

            return reply.status(201).send({ accessToken });
        } catch (err) {
            if (err instanceof InvalidCredentialsError) {
                return reply.status(400).send({ message: err.message });
            }
            throw err;
        }
    };

    private sessionValidator(body: FastifyRequestType["body"]) {
        return sessionBodySchema.parse(body);
    }
}
