import { FindManyEmployeeByCompanyIdUseCase } from "@/application/use-cases/employee/find-many-employee-by-company-id-use-case";
import { PrismaEmployeeRepository } from "@/infra/database/prisma/repositories/prisma-employee-repository";

export function makeFindManyEmployeeByCompanyId() {
    const employeeRepository = new PrismaEmployeeRepository();
    const findmanyemployeebycompanyidEmployeeUseCase = new FindManyEmployeeByCompanyIdUseCase(employeeRepository);

    return findmanyemployeebycompanyidEmployeeUseCase;
}
