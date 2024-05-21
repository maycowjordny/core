import { WorkPeriodRegister } from "@/domain/entities/work-period-register-entity";
import { UpdateWorkPeriodRegisterProps } from "@/domain/interfaces/work-period-register";
import { PRISMA_NOT_FOUND_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { WorkPeriodRegisterRepository } from "@/infra/database/repositories/work-period-register-repository";
import { CompanyNotFoundException } from "../company/errors/not-found-company-exception";
import { UpdateWorkPeriodRegisterException } from "./errors/update-work-period-register-exception";

export class UpdateWorkperiodRegisterUseCase {
    constructor(private workperiodregisterRepository: WorkPeriodRegisterRepository) { }

    async execute(workPeriodRegisterInput: UpdateWorkPeriodRegisterProps): Promise<WorkPeriodRegister> {

        try {
            return await this.workperiodregisterRepository.update(workPeriodRegisterInput);
        } catch (err: any) {
            if (err.code == PRISMA_NOT_FOUND_EXCEPTION) {
                throw new CompanyNotFoundException();
            }

            throw new UpdateWorkPeriodRegisterException(err);
        }
    }
}
