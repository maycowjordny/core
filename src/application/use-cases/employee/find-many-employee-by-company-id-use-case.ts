import { Employee } from "@/domain/entities/employee-entity";
import { EmployeeRequest } from "@/domain/interfaces/employee";
import { EmployeeRepository } from "@/infra/database/repositories/employee-repository";
import { FindManyEmployeeByCompanyIdException } from "./errors/find-many-employee-by-company-id-exception";

export class FindManyEmployeeByCompanyIdUseCase {
    constructor(private employeeRepository: EmployeeRepository) { }

    async execute(employeeInput: EmployeeRequest): Promise<Employee[]> {
        try {
            return await this.employeeRepository.findManyByCompany(employeeInput);
        } catch (err: any) {
            throw new FindManyEmployeeByCompanyIdException(err);
        }
    }
}
