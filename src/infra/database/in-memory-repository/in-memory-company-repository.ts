import { Company } from "@/domain/entities/company-entity";
import { UpdateCompanyProps } from "@/domain/interfaces/company";
import { CompanyRepository } from "../repositories/company-repository";

export class InMemoryCompanyRepository implements CompanyRepository {
    public items: Array<Company> = [];

    async create(company: Company): Promise<Company> {
        this.items.push(company);
        return company;
    }

    async update(company: UpdateCompanyProps): Promise<Company> {
        const companies = this.items.filter((item) => item.id == company.id)[0];

        const newCompany = new Company({
            ...companies.props,
            phone: company.phone,
            employeeQuantity: company.employeeQuantity,
            document: company.document,
            socialName: company.socialName,
            categoryId: company.categoryId,
        });

        return newCompany;
    }

}
