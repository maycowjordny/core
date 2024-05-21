import { User } from "@/domain/entities/user-entity";
import { UserRepository } from "@/infra/database/repositories/users-repository";

export class FindUserByEmailUseCase {
    constructor(private usersRepository: UserRepository) {}

    async execute(email: string): Promise<User | null> {
        return await this.usersRepository.findByEmail(email);
    }
}
