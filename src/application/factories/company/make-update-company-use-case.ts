import { UpdateCompanyUseCase } from "@/application/use-cases/company/update-company-use-case";
import { PrismaCompanyRepository } from "@/infra/database/prisma/repositories/prisma-company-repository";

export function makeUpdateCompany() {
    const companyRepository = new PrismaCompanyRepository();
    const updateCompanyUseCase = new UpdateCompanyUseCase(companyRepository);

    return updateCompanyUseCase;
}
