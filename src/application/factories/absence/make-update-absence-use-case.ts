import { UpdateAbsenceUseCase } from "@/application/use-cases/absence/update-absence-use-case";
import { PrismaAbsenceRepository } from "@/infra/database/prisma/repositories/prisma-absence-repository";

export function makeUpdateAbsence() {
    const absenceRepository = new PrismaAbsenceRepository();
    const updateAbsenceUseCase = new UpdateAbsenceUseCase(absenceRepository);

    return updateAbsenceUseCase;
}
