import { Absence } from "@/domain/entities/absence-entity";
import { AbsenceRepository } from "@/infra/database/repositories/absence-repository";
import { CreateAbsenceException } from "./errors/create-absence-exception";

export class CreateAbsenceUseCase {
    constructor(private absenceRepository: AbsenceRepository) { }

    async execute(absenceInput: Absence): Promise<Absence> {
        try {
            return await this.absenceRepository.create(absenceInput);
        } catch (err: any) {
            throw new CreateAbsenceException(err);
        }
    }
}
