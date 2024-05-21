import { WorkPeriod } from "@/domain/entities/work-period-entity";
import { PRISMA_NOT_FOUND_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { WorkPeriodRepository } from "@/infra/database/repositories/work-period-repository";
import { CompanyIdNotFoundException } from "./errors/companyId-not-found-exception";
import { FindManyWorkPeriodByCompanyIdException } from "./errors/list-work-period-exception-by-company";

export class FindManyWorkPeriodByCompanyIdUseCase {
    constructor(
        private workPeriodRepository: WorkPeriodRepository,
    ) { }

    async execute(companyId: string): Promise<WorkPeriod[]> {
        try {
            return await this.workPeriodRepository.findManyByCompany(companyId);
        } catch (err: any) {
            if (err.code == PRISMA_NOT_FOUND_EXCEPTION) {
                throw new CompanyIdNotFoundException();
            }
            throw new FindManyWorkPeriodByCompanyIdException();
        }
    }
}

