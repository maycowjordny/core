import { makeUpdateUser } from "@/application/factories/user/make-update-user-use-case";
import { UpdateUserException } from "@/application/use-cases/user/errors/update-user-exception";
import { updateUserProps } from "@/domain/interfaces/user";
import { FastifyReply, FastifyRequest } from "fastify";
import { userBodySchema } from "../../zod/schema/user/user-schema";

export class UserUpdateController {
    public update = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id } = request.params as { id: string };

            const userValidate = this.userValidator(request);

            const updateUserUseCase = makeUpdateUser();

            const updateUser: updateUserProps = {
                id,
                ...userValidate,
            };

            await updateUserUseCase.execute(updateUser);

            reply.status(201).send({ message: "User update successfully!" });
        } catch (err) {
            if (err instanceof UpdateUserException) {
                reply.status(400).send({ message: err.message });
            } else {
                throw err;
            }
        }
    };

    private userValidator(request: FastifyRequest) {
        return userBodySchema.parse(request.body);
    }

}
