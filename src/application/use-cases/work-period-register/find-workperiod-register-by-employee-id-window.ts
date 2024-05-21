import { WorkPeriodRegister } from "@/domain/entities/work-period-register-entity";
import { findByEmployeeAndTimeWindowRequest } from "@/domain/interfaces/work-period-register";
import { PRISMA_NOT_FOUND_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { WorkPeriodRegisterRepository } from "@/infra/database/repositories/work-period-register-repository";
import { EmployeeIdNotFoundException } from "../../errors/employee-id-not-found";
import { FindByEmployeeAndTimeWindowException } from "../../errors/find-by-employee-and-time-window-exception";

export class FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase {
    constructor(private repository: WorkPeriodRegisterRepository) { }

    async execute(workPeriodRegisterInput: findByEmployeeAndTimeWindowRequest): Promise<WorkPeriodRegister[]> {

        try {
            const workPeriod = await this.repository.findByEmployeeAndTimeWindow(workPeriodRegisterInput);

            return workPeriod;
        } catch (err: any) {
            if (err.code == PRISMA_NOT_FOUND_EXCEPTION) {
                throw new EmployeeIdNotFoundException();
            }

            throw new FindByEmployeeAndTimeWindowException(err);
        }
    }
}
