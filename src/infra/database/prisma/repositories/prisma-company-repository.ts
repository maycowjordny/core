import { Company } from "@/domain/entities/company-entity";
import { User } from "@/domain/entities/user-entity";
import { UpdateCompanyProps } from "@/domain/interfaces/company";
import { prisma } from "../../lib/prisma";
import { CompanyRepository } from "../../repositories/company-repository";
import { CompanyMapper } from "../mappers/company/company-mapper";
import { CreateCompanyMapper } from "../mappers/company/create-company-mapper";
import { UpdateCompanyMapper } from "../mappers/company/update-company-mapper";
import { CreateUserMapper } from "../mappers/user/create-user-mapper";

export class PrismaCompanyRepository implements CompanyRepository {
    async create(company: Company): Promise<Company> {
        const result = await prisma.$transaction(async (tx) => {

            const createCompany = await tx.company.create({
                data: CreateCompanyMapper.convertToPrisma(company),
                include: {
                    address: true,
                    category: true,
                }
            });

            const createUserEntity = new User({
                ...company.user!.props,
                companyId: createCompany.id
            });

            const createUser = await tx.user.create({
                data: CreateUserMapper.convertToPrisma(createUserEntity),
            });

            return { company: createCompany, user: createUser };
        });

        return CompanyMapper.toDomainCreateCompanyAndUser(result.company, result.user);
    }

    async update(company: UpdateCompanyProps): Promise<Company> {
        const result = await prisma.company.update({
            where: {
                id: company.id,
            },
            data: UpdateCompanyMapper.convertToPrisma(company),
            include: {
                address: true,
                category: true,
            }
        });

        return CompanyMapper.toDomainUpdate(result);
    }

}
