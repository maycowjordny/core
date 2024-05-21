import { CreateWorkPeriodDayUseCase } from "@/application/use-cases/work-period-day/create-work-period-day-use-case";
import { PrismaWorkPeriodDayRepository } from "@/infra/database/prisma/repositories/prisma-work-period-day";

export function makeCreateWorkperiodDay() {
    const workperioddayRepository = new PrismaWorkPeriodDayRepository();
    const createWorkperiodDayUseCase = new CreateWorkPeriodDayUseCase(workperioddayRepository);

    return createWorkperiodDayUseCase;
}
