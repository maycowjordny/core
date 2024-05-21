import { SendEmailUseCase } from "@/application/use-cases/auth/email/send-email-use-case";
import { CreateCompanyUseCase } from "@/application/use-cases/company/create-company-use-case";
import { PrismaCompanyRepository } from "@/infra/database/prisma/repositories/prisma-company-repository";

export function makeCreateCompany() {
    const companyRepository = new PrismaCompanyRepository();
    const sendEmailUseCase = new SendEmailUseCase();
    const createCompanyUseCase = new CreateCompanyUseCase(companyRepository, sendEmailUseCase);

    return createCompanyUseCase;
}
