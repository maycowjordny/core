import { FindManyAbsenceByCompanyIdUseCase } from "@/application/use-cases/absence/find-many-absences-by-company-id";
import { PrismaAbsenceRepository } from "@/infra/database/prisma/repositories/prisma-absence-repository";

export function makeFindManyAbsenceByCompanyId() {
    const absenceRepository = new PrismaAbsenceRepository();
    const findmanyabsencebycompanyidAbsenceUseCase = new FindManyAbsenceByCompanyIdUseCase(absenceRepository);

    return findmanyabsencebycompanyidAbsenceUseCase;
}
