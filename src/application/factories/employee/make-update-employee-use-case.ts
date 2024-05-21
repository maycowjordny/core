import { UpdateEmployeeUseCase } from "@/application/use-cases/employee/update-employee-use-case";
import { PrismaEmployeeRepository } from "@/infra/database/prisma/repositories/prisma-employee-repository";

export function makeUpdateEmployee() {
    const employeeRepository = new PrismaEmployeeRepository();
    const updateEmployeeUseCase = new UpdateEmployeeUseCase(employeeRepository);

    return updateEmployeeUseCase;
}
