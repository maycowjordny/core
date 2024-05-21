import { makeValidadeConfirmationCode } from "@/application/factories/company/make-validate-confirmation-code-use-case";
import { ValidateConfirmationCodeException } from "@/application/use-cases/user/errors/validade-code-confirmation-exception";
import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyRequestType } from "fastify/types/type-provider";
import { confirmationCodeSchema } from "../../zod/schema/company/confirmation-code-schema";

export class ValidateConfirmationCodeController {
    public validate = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { email, confirmationCode } = this.confirmationCodeValidator(request.body);

            const validadeConfirmationCodeUseCase = makeValidadeConfirmationCode();

            const { accessToken } = await validadeConfirmationCodeUseCase.execute({ email, confirmationCode });

            reply.status(200).send({ accessToken });
        } catch (err) {
            if (err instanceof ValidateConfirmationCodeException) {
                reply.status(400).send({ message: err.message });
            }
            throw err;
        }
    };

    private confirmationCodeValidator(body: FastifyRequestType["body"]) {
        return confirmationCodeSchema.parse(body);
    }
}
