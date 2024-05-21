import { CreateWorkPeriodUseCase } from "@/application/use-cases/work-period/create-work-period-use-case";
import { PrismaWorkPeriodRepository } from "@/infra/database/prisma/repositories/prisma-work-period-repository";

export function makeCreateWorkPeriod() {
    const workperiodRepository = new PrismaWorkPeriodRepository();
    const createWorkPeriodUseCase = new CreateWorkPeriodUseCase(workperiodRepository);

    return createWorkPeriodUseCase;
}
