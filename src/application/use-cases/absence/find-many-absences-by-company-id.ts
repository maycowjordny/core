import { Absence } from "@/domain/entities/absence-entity";
import { AbsenceRequest } from "@/domain/interfaces/absence";
import { AbsenceRepository } from "@/infra/database/repositories/absence-repository";
import { AbsenceNotFoundException } from "./errors/absence-not-found-axception";
import { FindAbsenceByCompanyIdException } from "./errors/find-many-absence-by-company-id-exception";

export class FindManyAbsenceByCompanyIdUseCase {
    constructor(private absenceRepository: AbsenceRepository) { }

    async execute(absenceInput: AbsenceRequest): Promise<Absence[]> {
        try {
            return await this.absenceRepository.findManyByCompany(absenceInput);
        } catch (err: any) {
            if (err instanceof AbsenceNotFoundException) {
                throw new AbsenceNotFoundException();
            }

            throw new FindAbsenceByCompanyIdException(err);
        }
    }
}
