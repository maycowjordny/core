import { Company } from "@/domain/entities/company-entity";
import { Prisma } from "@prisma/client";
import { CompanyMapper } from "./company-mapper";

export class CreateCompanyMapper extends CompanyMapper {
    static convertToPrisma(data: Company): Prisma.CompanyCreateInput {
        return {
            employeeQuantity: data.employeeQuantity,
            phone: data.phone,
            document: data.document,
            socialName: data.socialName,
            address: { create: { ...data.address.props } },
            category: { connect: { id: data.categoryId } },
        };
    }
}
