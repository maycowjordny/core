import { FindManyWorkPeriodByCompanyIdUseCase } from "@/application/use-cases/work-period/find-many-work-period-by-company-use-case";
import { PrismaWorkPeriodRepository } from "@/infra/database/prisma/repositories/prisma-work-period-repository";

export function makeFindManyWorkPeriodByCompanyId() {
    const workperiodRepository = new PrismaWorkPeriodRepository();
    const findManyWorkPeriodByCompanyIdUseCase = new FindManyWorkPeriodByCompanyIdUseCase(workperiodRepository);

    return findManyWorkPeriodByCompanyIdUseCase;
}
