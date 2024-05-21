import { UpdateCompanyProps } from "@/domain/interfaces/company";
import { Prisma } from "@prisma/client";
import { CompanyMapper } from "./company-mapper";

export class UpdateCompanyMapper extends CompanyMapper {
    static convertToPrisma(data: UpdateCompanyProps): Prisma.CompanyUncheckedUpdateInput {
        return {
            employeeQuantity: data.employeeQuantity,
            phone: data.phone,
            document: data.document,
            socialName: data.socialName,
        };
    }
}
