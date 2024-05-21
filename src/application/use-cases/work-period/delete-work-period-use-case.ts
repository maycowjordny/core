import { WorkPeriodRepository } from "@/infra/database/repositories/work-period-repository";
import { DeleteWorkPeriodException } from "./errors/delete-absence-exception";

export class DeleteWorkPeriodUseCase {
    constructor(private workperiodRepository: WorkPeriodRepository) { }

    async execute(id: string): Promise<null> {
        try {
            return await this.workperiodRepository.delete(id);
        } catch (err: any) {
            throw new DeleteWorkPeriodException(err);
        }
    }
}
