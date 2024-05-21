import { ExtraWorkPeriod } from "@/domain/entities/extra-work-period-entity";
import { ExtraWorkPeriodRequest } from "@/domain/interfaces/extra-work-period";
import { ExtraWorkPeriodRepository } from "@/infra/database/repositories/extra-work-period-repository";
import { ListExtraWorkPeriodByWorkPeriodIdException } from "./errors/list-extra-work-period-by-work-period-id-exception";

export class ListExtraWorkPeriodByWorkPeriodIdUseCase {
    constructor(private extraworkperiodRepository: ExtraWorkPeriodRepository) { }

    async execute(extraWorkPeriodRequest: ExtraWorkPeriodRequest): Promise<ExtraWorkPeriod[]> {
        try {
            return await this.extraworkperiodRepository.listByWorkPeriod(extraWorkPeriodRequest);
        } catch (err: any) {
            throw new ListExtraWorkPeriodByWorkPeriodIdException();
        }
    }
}
