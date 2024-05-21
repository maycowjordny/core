import { FindLocationByEmployeeIdUseCase } from "@/application/use-cases/employee/find-location-by-id-use-case";
import { CreateOrUpdateWorkPeriodRegisterUseCase } from "@/application/use-cases/work-period-register/create-or-update-work-period-register-use-case";
import { FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase } from "@/application/use-cases/work-period-register/find-workperiod-register-by-employee-id-window";
import { IsLocationNearbyUseCase } from "@/application/use-cases/work-period-register/is-location-nearby-use-case";
import { UpdateWorkperiodRegisterUseCase } from "@/application/use-cases/work-period-register/update-work-period-register-use-case";
import { FindWorkPeriodByCodWorkPeriodAndDayUseCase } from "@/application/use-cases/work-period/find-workperiod-by-code-work-period-and-day";
import { PrismaEmployeeRepository } from "@/infra/database/prisma/repositories/prisma-employee-repository";
import { PrismaWorkPeriodRegisterRepository } from "@/infra/database/prisma/repositories/prisma-work-period-register-repository";
import { PrismaWorkPeriodRepository } from "@/infra/database/prisma/repositories/prisma-work-period-repository";

const workPeriodRegisterRepository = new PrismaWorkPeriodRegisterRepository();
const employeeRepository = new PrismaEmployeeRepository();
const findWorkPeriodRegisterByEmployeeIdWindowUseCase = new FindWorkPeriodRegisterByEmployeeIdAndTimeWindowUseCase(workPeriodRegisterRepository);
const findLocationByEmployeeIdUseCase = new FindLocationByEmployeeIdUseCase(employeeRepository);
const isLocationNearbyUseCase = new IsLocationNearbyUseCase();
const updateworkPeriodRegisterUseCase = new UpdateWorkperiodRegisterUseCase(workPeriodRegisterRepository);

const workPeriodRepository = new PrismaWorkPeriodRepository();
const findWorkPeriodByCodWorkPeriodUseCase = new FindWorkPeriodByCodWorkPeriodAndDayUseCase(workPeriodRepository);

export function makeCreateOrUpdateWorkPeriodRegister() {
    const createWorkPeriodRegisterUseCase = new CreateOrUpdateWorkPeriodRegisterUseCase(
        workPeriodRegisterRepository,
        updateworkPeriodRegisterUseCase,
        findLocationByEmployeeIdUseCase,
        findWorkPeriodByCodWorkPeriodUseCase,
        isLocationNearbyUseCase,
        findWorkPeriodRegisterByEmployeeIdWindowUseCase
    );

    return createWorkPeriodRegisterUseCase;
}
