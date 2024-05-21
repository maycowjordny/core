import { Company } from "@/domain/entities/company-entity";
import { UpdateCompanyProps } from "@/domain/interfaces/company";
import { PRISMA_NOT_FOUND_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { CompanyRepository } from "@/infra/database/repositories/company-repository";
import { CompanyNotFoundException } from "./errors/not-found-company-exception";
import { UpdateCompanyException } from "./errors/update-company-exception";

export class UpdateCompanyUseCase {
    constructor(private companyRepository: CompanyRepository) { }

    async execute(companyInput: UpdateCompanyProps): Promise<Company> {
        try {
            return await this.companyRepository.update(companyInput);
        } catch (err: any) {
            if (err.code == PRISMA_NOT_FOUND_EXCEPTION) {
                throw new CompanyNotFoundException();
            }

            throw new UpdateCompanyException(err);
        }
    }
}
