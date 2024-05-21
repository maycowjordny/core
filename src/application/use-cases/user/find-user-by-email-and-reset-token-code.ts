import { User } from "@/domain/entities/user-entity";
import { AuthResetToken } from "@/domain/interfaces/auth/auh-reset-token";
import { UserRepository } from "@/infra/database/repositories/users-repository";

export class FindUserByEmailAndResetTokenUseCase {
    constructor(private usersRepository: UserRepository) { }

    async execute(data: AuthResetToken): Promise<User | null> {
        return await this.usersRepository.findByEmailAndResetToken(data);
    }
}
