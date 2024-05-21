import { FindEmployeeByUserIdUseCase } from "@/application/use-cases/employee/find-employee-by-user-id-use-case";
import { PrismaEmployeeRepository } from "@/infra/database/prisma/repositories/prisma-employee-repository";

export function makeFindEmployeeByUserId() {
    const employeeRepository = new PrismaEmployeeRepository();
    const findEmployeeUseCase = new FindEmployeeByUserIdUseCase(employeeRepository);

    return findEmployeeUseCase;
}
