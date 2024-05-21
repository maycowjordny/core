import { WorkPeriod } from "@/domain/entities/work-period-entity";
import { WorkPeriodRepository } from "@/infra/database/repositories/work-period-repository";
import { CreateWorkPeriodException } from "./errors/work-period-create-exception";

export class CreateWorkPeriodUseCase {
    constructor(private workPeriodRepository: WorkPeriodRepository) { }

    async execute(workPeriodInput: WorkPeriod): Promise<WorkPeriod> {
        try {
            return await this.workPeriodRepository.create(workPeriodInput);
        } catch (err: any) {
            throw new CreateWorkPeriodException(err);
        }
    }
}
