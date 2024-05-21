import { User } from "@/domain/entities/user-entity";
import { UserRoleEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { AuthInput } from "@/domain/interfaces/auth/auth-input";
import { AuthPayload } from "@/domain/interfaces/auth/auth-payload";
import { AuthToken } from "@/domain/interfaces/auth/auth-token";
import { UserRepository } from "@/infra/database/repositories/users-repository";
import { compare } from "bcryptjs";
import { GenerateJwtUseCase } from "../auth/generate-jwt-use-case";
import { ValidatePasswordException } from "./errors/create-session-exception-error";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

export class ValidatePasswordUseCase {
    constructor(
        private usersRepository: UserRepository,
        private generateJwtUseCase: GenerateJwtUseCase
    ) { }

    async execute({ email, password }: AuthInput): Promise<AuthToken> {

        try {
            const user = await this.usersRepository.findByEmail(email);

            if (!user) throw new InvalidCredentialsError();

            const doesPasswordMacthes = await compare(password, user.password);

            if (!doesPasswordMacthes) throw new InvalidCredentialsError();

            return await this.generateJwt(user);
        } catch (err: any) {
            if (err instanceof InvalidCredentialsError) {
                throw new InvalidCredentialsError();
            }
            throw new ValidatePasswordException(err);
        }

    }
    private async generateJwt(user: User) {

        const payload: AuthPayload = {
            sub: user.id,
            companyId: user.companyId!,
            email: user.email,
            name: user.name,
            roles: UserRoleEnum[user.role],
            type: UserTypesEnum[user.type],
        };

        return await this.generateJwtUseCase.execute(payload);
    }
}
