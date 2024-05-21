import { WorkPeriod } from "@/domain/entities/work-period-entity";
import { UpdateWorkPeriodProps } from "@/domain/interfaces/work-period";
import { PRISMA_NOT_FOUND_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { WorkPeriodRepository } from "@/infra/database/repositories/work-period-repository";
import { CompanyNotFoundException } from "../company/errors/not-found-company-exception";
import { UpdateWorkPeriodException } from "./errors/update-work-period-exception";

export class UpdateWorkPeriodUseCase {
    constructor(private workperiodRepository: WorkPeriodRepository) { }

    async execute(workperiodInput: UpdateWorkPeriodProps): Promise<WorkPeriod> {
        try {
            return await this.workperiodRepository.update(workperiodInput);
        } catch (err: any) {
            if (err.code == PRISMA_NOT_FOUND_EXCEPTION) {
                throw new CompanyNotFoundException();
            }

            throw new UpdateWorkPeriodException(err);
        }
    }
}
