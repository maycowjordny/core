import { ExtraWorkPeriod } from "@/domain/entities/extra-work-period-entity";
import { ExtraWorkPeriodRepository } from "@/infra/database/repositories/extra-work-period-repository";
import { CreateExtraWorkPeriodException } from "./errors/create-extra-work-period-exception";

export class CreateExtraWorkPeriodUseCase {
    constructor(private extraWorkPeriodRepository: ExtraWorkPeriodRepository) { }

    async execute(extraWorkPeriodInput: ExtraWorkPeriod): Promise<ExtraWorkPeriod> {
        try {
            const extraWorkPeriodToCreate = new ExtraWorkPeriod({ ...extraWorkPeriodInput.props });

            return await this.extraWorkPeriodRepository.create(extraWorkPeriodToCreate);
        } catch (err: any) {
            throw new CreateExtraWorkPeriodException();
        }
    }
}
