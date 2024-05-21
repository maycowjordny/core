import { Company } from "@/domain/entities/company-entity";
import { User } from "@/domain/entities/user-entity";
import { UserStatusEnum } from "@/domain/enum/user-enum";
import { CompanyRepository } from "@/infra/database/repositories/company-repository";
import { hashPassword } from "@/utils/generate-hash";
import { generateCode } from "@/utils/generate-verification-code";
import { SendEmailUseCase } from "../auth/email/send-email-use-case";
import { CreateCompanyException } from "./errors/create-company-exception";

export class CreateCompanyUseCase {
    constructor(
        private companyRepository: CompanyRepository,
        private sendEmailUseCase: SendEmailUseCase
    ) { }

    async execute(companyInput: Company): Promise<Company> {
        try {
            const createUser = new User({
                ...companyInput.user!.props,
                password: await hashPassword(companyInput.user!.password),
                status: UserStatusEnum.PENDING,
                confirmationCode: generateCode(6),
            });

            await this.sendEmailUseCase.execute(createUser, {
                subject: "Código de verificação",
                html:
                    `
                <h1>Olá ${createUser.name},</h1>
                <p>Seu código de verificação é:</p>
                <h2>${createUser.confirmationCode}</h2>
                <p>Use este código para verificar sua conta.</p>
                `
            });

            const newCompany = new Company({
                ...companyInput.props,
                user: createUser
            });

            return await this.companyRepository.create(newCompany);
        } catch (err: any) {
            throw new CreateCompanyException(err);
        }
    }

}
