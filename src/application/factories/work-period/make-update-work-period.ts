import { UpdateWorkPeriodUseCase } from "@/application/use-cases/work-period/update-work-period-use-case";
import { PrismaWorkPeriodRepository } from "@/infra/database/prisma/repositories/prisma-work-period-repository";

export function makeUpdateWorkPeriod() {
    const workperiodRepository = new PrismaWorkPeriodRepository();
    const updateWorkPeriodUseCase = new UpdateWorkPeriodUseCase(workperiodRepository);

    return updateWorkPeriodUseCase;
}
