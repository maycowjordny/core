import { User } from "@/domain/entities/user-entity";
import { UpdateUserProps } from "@/domain/interfaces/user";
import { PRISMA_NOT_FOUND_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { UserRepository } from "@/infra/database/repositories/users-repository";
import { UpdateUserException } from "./errors/update-user-exception";
import { UserNotFoundException } from "./errors/user-not-found-exception";

export class UpdateUserUseCase {
    constructor(private userRepository: UserRepository) { }

    async execute(userInput: UpdateUserProps): Promise<User> {
        try {
            return await this.userRepository.update(userInput);
        } catch (err: any) {
            if (err.code == PRISMA_NOT_FOUND_EXCEPTION) {
                throw new UserNotFoundException();
            }

            throw new UpdateUserException();
        }
    }
}
