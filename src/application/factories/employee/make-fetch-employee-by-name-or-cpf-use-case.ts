import { FetchEmployeeByCpfOrNameUseCase } from "@/application/use-cases/employee/fetch-employee-by-cpf-or-name-use-case";
import { PrismaEmployeeRepository } from "@/infra/database/prisma/repositories/prisma-employee-repository";

export function makeFetchEmployeeByNameOrCpf() {
    const employeeRepository = new PrismaEmployeeRepository();
    const fetchEmployeeByCpfOrNameUseCase = new FetchEmployeeByCpfOrNameUseCase(employeeRepository);

    return fetchEmployeeByCpfOrNameUseCase;
}
