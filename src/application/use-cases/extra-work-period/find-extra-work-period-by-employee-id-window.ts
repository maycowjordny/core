import { EmployeeIdNotFoundException } from "@/application/errors/employee-id-not-found";
import { FindByEmployeeAndTimeWindowException } from "@/application/errors/find-by-employee-and-time-window-exception";
import { ExtraWorkPeriod } from "@/domain/entities/extra-work-period-entity";
import { findByEmployeeAndTimeWindowRequest } from "@/domain/interfaces/work-period-register";
import { PRISMA_NOT_FOUND_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { ExtraWorkPeriodRepository } from "@/infra/database/repositories/extra-work-period-repository";
import { ExtraWorkPeriodNotFoundException } from "./errors/extra-work-period-not-found-exception";

export class FindExtraWorkPeriodByEmployeeIdUseCase {
    constructor(private extraworkperiodRepository: ExtraWorkPeriodRepository) { }

    async execute(extraWorkPeriodInput: findByEmployeeAndTimeWindowRequest): Promise<ExtraWorkPeriod[] | null> {
        try {
            const extraWorkPeriod = await this.extraworkperiodRepository.findByEmployeeAndTimeWindow(extraWorkPeriodInput);

            if (!extraWorkPeriod) throw new ExtraWorkPeriodNotFoundException();

            return extraWorkPeriod;
        } catch (err: any) {
            if (err.code == PRISMA_NOT_FOUND_EXCEPTION) {
                throw new EmployeeIdNotFoundException();
            }

            if (err instanceof ExtraWorkPeriodNotFoundException) {
                throw new ExtraWorkPeriodNotFoundException();
            }

            throw new FindByEmployeeAndTimeWindowException(err);
        }
    }
}

