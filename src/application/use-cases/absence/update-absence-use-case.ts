import { Absence } from "@/domain/entities/absence-entity";
import { AbsenceRepository } from "@/infra/database/repositories/absence-repository";
import { UpdateAbsenceException } from "./errors/update-absence-exception";

export class UpdateAbsenceUseCase {
    constructor(private absenceRepository: AbsenceRepository) { }

    async execute(absenceInput: Absence): Promise<Absence> {
        try {
            return await this.absenceRepository.update(absenceInput);
        } catch (err: any) {
            throw new UpdateAbsenceException(err);
        }
    }
}
