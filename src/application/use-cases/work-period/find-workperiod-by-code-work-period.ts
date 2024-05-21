import { WorkPeriod } from "@/domain/entities/work-period-entity";
import { PRISMA_NOT_FOUND_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { WorkPeriodRepository } from "@/infra/database/repositories/work-period-repository";
import { EmployeeIdNotFoundException } from "../../errors/employee-id-not-found";

export class FindWorkPeriodByCodWorkPeriodUseCase {
    constructor(
        private workPeriodRepository: WorkPeriodRepository,
    ) { }

    async execute(codWorkPeriod: string): Promise<WorkPeriod | null> {
        try {
            return await this.workPeriodRepository.findByCodWorkPeriod(codWorkPeriod);
        } catch (err: any) {
            if (err.code == PRISMA_NOT_FOUND_EXCEPTION) {
                throw new EmployeeIdNotFoundException();
            }

            throw new FindWorkPeriodByCodWorkPeriodUseCase(err);
        }
    }
}
