import { DeactivateEmployeeUseCase } from "@/application/use-cases/employee/deactivate-employee-use-case";
import { PrismaEmployeeRepository } from "@/infra/database/prisma/repositories/prisma-employee-repository";

export function makeDeactivateEmployee() {
    const employeeRepository = new PrismaEmployeeRepository();
    const deactivateEmployeeUseCase = new DeactivateEmployeeUseCase(employeeRepository);

    return deactivateEmployeeUseCase;
}
