import { DeleteAbsenceUseCase } from "@/application/use-cases/absence/delete-absence-use-case";
import { PrismaAbsenceRepository } from "@/infra/database/prisma/repositories/prisma-absence-repository";

export function makeDeleteAbsence() {
    const absenceRepository = new PrismaAbsenceRepository();
    const deleteAbsenceUseCase = new DeleteAbsenceUseCase(absenceRepository);

    return deleteAbsenceUseCase;
}
