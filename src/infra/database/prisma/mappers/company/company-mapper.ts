import { Company } from "@/domain/entities/company-entity";
import { Prisma, User } from "@prisma/client";
import { AddressMapper } from "../address/address-mapper";
import { UserMapper } from "../user/user-mapper";

export class CompanyMapper {
    static toDomain(company: Prisma.CompanyGetPayload<{ include: { address: true, category: true } }>): Company {
        return new Company({
            id: company.id,
            socialName: company.socialName,
            address: AddressMapper.toDomain(company.address),
            categoryId: company.category.id,
            employeeQuantity: company.employeeQuantity,
            document: company.document,
            phone: company.phone,
        });
    }

    static toDomainCreateCompanyAndUser(company: Prisma.CompanyGetPayload<{ include: { address: true, category: true } }>, user: User): Company {
        return new Company({
            id: company.id,
            socialName: company.socialName,
            user: UserMapper.toDomain(user),
            address: AddressMapper.toDomain(company.address),
            categoryId: company.category.id,
            employeeQuantity: company.employeeQuantity,
            document: company.document,
            phone: company.phone,
        });
    }

    static toDomainUpdate(company: Prisma.CompanyGetPayload<{ include: { address: true, category: true } }>): Company {
        return new Company({
            id: company.id,
            socialName: company.socialName,
            address: AddressMapper.toDomain(company.address),
            categoryId: company.category.id,
            employeeQuantity: company.employeeQuantity,
            document: company.document,
            phone: company.phone,
        });
    }
}
