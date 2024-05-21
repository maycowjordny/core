import { User } from "@/domain/entities/user-entity";
import { PRISMA_UNIQUE_KEY_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { UserRepository } from "@/infra/database/repositories/users-repository";
import { CreateUserEmailException } from "./errors/create-user-email-exception";
import { CreateUserException } from "./errors/create-user-exception";

export class CreateUserUseCase {
    constructor(private usersRepository: UserRepository) { }

    async execute(userInput: User): Promise<User> {
        const userToCreate = new User({ ...userInput.props });

        try {
            const user = await this.usersRepository.create(userToCreate);

            if (!user) throw new CreateUserException();

            return user;
        } catch (err: any) {
            if (err.code == PRISMA_UNIQUE_KEY_EXCEPTION) {
                throw new CreateUserEmailException(userToCreate.email);
            }
            throw new CreateUserException((err as Error).message);
        }
    }
}
