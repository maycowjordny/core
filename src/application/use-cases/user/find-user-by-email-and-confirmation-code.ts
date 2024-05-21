import { User } from "@/domain/entities/user-entity";
import { AuthConfirmationCode } from "@/domain/interfaces/auth/auth-confirmation-code";
import { UserRepository } from "@/infra/database/repositories/users-repository";

export class FindUserByEmailAndConfirmationCodeUseCase {
    constructor(private usersRepository: UserRepository) { }

    async execute(data: AuthConfirmationCode): Promise<User | null> {
        return await this.usersRepository.findByEmailAndConfirmationCode(data);
    }
}
