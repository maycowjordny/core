import { makeCreateUser } from "@/application/factories/user/make-create-user-use-case";
import { CreateUserException } from "@/application/use-cases/user/errors/create-user-exception";
import { User } from "@/domain/entities/user-entity";
import { UserRoleEnum, UserStatusEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { FastifyReply, FastifyRequest } from "fastify";
import { userBodySchema } from "../../zod/schema/user/user-schema";

export class CreateSubUserController {
    public create = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userValidate = this.userValidator(request);
            const { companyId } = request.user;

            const createUserUseCase = makeCreateUser();

            const createUser = new User({
                ...userValidate,
                type: UserTypesEnum.COMPANY,
                role: UserRoleEnum.BASIC,
                companyId: companyId,
                status: UserStatusEnum.ACTIVE
            });

            const subUser = await createUserUseCase.execute(createUser);

            reply.status(201).send({ subUserId: subUser.id });
        } catch (err) {
            if (err instanceof CreateUserException) {
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
