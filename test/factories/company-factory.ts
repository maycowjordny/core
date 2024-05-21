import { Address } from "@/domain/entities/address-entity";
import { Company, CompanyProps } from "@/domain/entities/company-entity";
import { User } from "@/domain/entities/user-entity";
import { prisma } from "@/infra/database/lib/prisma";
import { CompanyMapper } from "@/infra/database/prisma/mappers/company/company-mapper";
import { CreateCompanyMapper } from "@/infra/database/prisma/mappers/company/create-company-mapper";
import { CreateUserMapper } from "@/infra/database/prisma/mappers/user/create-user-mapper";
import { faker } from "@faker-js/faker";
import { makeFakeAddress } from "./address-factory";
import { makeFakeUser } from "./user-factory";

type CompanyOverrides = {
    id?: string;
    categoryId?: string;
    phone?: string;
    socialName?: string;
    user?: User
    address?: Address;
    document?: string;
    employeeQuantity?: number;
    createdAt?: Date;
    updatedAt?: Date;
};

export function makeFakeCompany(data = {} as CompanyOverrides) {
    const phone = faker.phone.number();
    const socialName = faker.company.name();
    const employeeQuantity = faker.number.int({ min: 10, max: 100 });
    const document = faker.string.numeric();
    const address = makeFakeAddress();
    const user = makeFakeUser({ id: "userId-01" });

    const props: CompanyProps = {
        id: data.id ?? "",
        address: data.address || address,
        categoryId: data.categoryId ?? "",
        user: data.user || user,
        document: data.document || document,
        socialName: data.socialName || socialName,
        employeeQuantity: data.employeeQuantity || employeeQuantity,
        phone: data.phone || phone,
    };

    const company = Company.create(props);

    return company;
}

export class CompanyFactory {
    async makeCompany(data = {} as CompanyOverrides): Promise<Company> {
        const company = makeFakeCompany(data);

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
}
