import { CreateAbsenceUseCase } from "@/application/use-cases/absence/create-absence-use-case";
import { PrismaAbsenceRepository } from "@/infra/database/prisma/repositories/prisma-absence-repository";

export function makeCreateAbsence() {
    const absenceRepository = new PrismaAbsenceRepository();
    const createAbsenceUseCase = new CreateAbsenceUseCase(absenceRepository);

    return createAbsenceUseCase;
}
