import { Company } from "@/domain/entities/company-entity";
import { UpdateCompanyProps } from "@/domain/interfaces/company";

export interface CompanyRepository {
  create(company: Company): Promise<Company>;
  update(company: UpdateCompanyProps): Promise<Company>;

}
