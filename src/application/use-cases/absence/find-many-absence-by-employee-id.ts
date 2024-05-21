import { Absence } from "@/domain/entities/absence-entity";
import { AbsenceRepository } from "@/infra/database/repositories/absence-repository";
import { AbsenceNotFoundException } from "./errors/absence-not-found-axception";
import { FindAbsenceByEmployeeIdException } from "./errors/find-many-absence-by-employee-id-exception";

export class FindManyAbsenceByEmployeeIdUseCase {
    constructor(private absenceRepository: AbsenceRepository) { }

    async execute(employeeId: string): Promise<Absence[]> {
        try {
            return await this.absenceRepository.findManyByEmployee(employeeId);
        } catch (err: any) {
            if (err instanceof AbsenceNotFoundException) {
                throw new AbsenceNotFoundException();
            }

            throw new FindAbsenceByEmployeeIdException(err);
        }
    }
}
