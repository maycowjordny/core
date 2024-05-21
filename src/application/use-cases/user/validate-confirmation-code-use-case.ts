import { User } from "@/domain/entities/user-entity";
import { UserRoleEnum, UserStatusEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { AuthConfirmationCode } from "@/domain/interfaces/auth/auth-confirmation-code";
import { AuthPayload } from "@/domain/interfaces/auth/auth-payload";
import { AuthToken } from "@/domain/interfaces/auth/auth-token";
import { UpdateUserProps } from "@/domain/interfaces/user";
import { UserRepository } from "@/infra/database/repositories/users-repository";
import { GenerateJwtUseCase } from "../auth/generate-jwt-use-case";
import { InvalidCodeConfirmationError } from "./errors/invalid-code-confirmation-exception";
import { ValidateConfirmationCodeException } from "./errors/validade-code-confirmation-exception";

export class ValidateCodeConfirmationUseCase {
    constructor(
        private usersRepository: UserRepository,
        private generateJwtUseCase: GenerateJwtUseCase
    ) { }

    async execute({ email, confirmationCode }: AuthConfirmationCode): Promise<AuthToken> {

        try {
            const user = await this.usersRepository.findByEmailAndConfirmationCode({ email, confirmationCode });

            if (!user) throw new InvalidCodeConfirmationError();

            const userActive: UpdateUserProps = {
                ...user.props,
                id: user.id!,
                status: UserStatusEnum.ACTIVE
            };

            await this.usersRepository.update(userActive);

            return await this.generateJwt(user);

        } catch (err: any) {
            if (err instanceof InvalidCodeConfirmationError) {
                throw new InvalidCodeConfirmationError();
            }
            throw new ValidateConfirmationCodeException(err);
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
