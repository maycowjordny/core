import { UpdateWorkPeriodDayUseCase } from "@/application/use-cases/work-period-day/update-work-period-day-use-case";
import { PrismaWorkPeriodDayRepository } from "@/infra/database/prisma/repositories/prisma-work-period-day";

export function makeUpdateWorkperiodDay() {
    const workperioddayRepository = new PrismaWorkPeriodDayRepository();
    const updateWorkperiodDayUseCase = new UpdateWorkPeriodDayUseCase(workperioddayRepository);

    return updateWorkperiodDayUseCase;
}
