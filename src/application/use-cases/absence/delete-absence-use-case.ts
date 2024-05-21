import { AbsenceRepository } from "@/infra/database/repositories/absence-repository";
import { DeleteAbsenceException } from "./errors/delete-absence-exception";

export class DeleteAbsenceUseCase {
    constructor(private absenceRepository: AbsenceRepository) { }

    async execute(id: string): Promise<null> {
        try {
            return await this.absenceRepository.delete(id);
        } catch (err: any) {
            throw new DeleteAbsenceException(err);
        }
    }
}
