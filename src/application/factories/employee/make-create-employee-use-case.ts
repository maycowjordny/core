import { CreateEmployeeUseCase } from "@/application/use-cases/employee/create-employee-use-case";
import { PrismaEmployeeRepository } from "@/infra/database/prisma/repositories/prisma-employee-repository";

export function makeCreateEmployee() {
    const employeeRepository = new PrismaEmployeeRepository();
    const createEmployeeUseCase = new CreateEmployeeUseCase(employeeRepository);

    return createEmployeeUseCase;
}
