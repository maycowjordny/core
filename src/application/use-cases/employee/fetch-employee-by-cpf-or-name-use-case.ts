import { Employee } from "@/domain/entities/employee-entity";
import { EmployeeRepository } from "@/infra/database/repositories/employee-repository";

export class FetchEmployeeByCpfOrNameUseCase {
    constructor(private employeeRepository: EmployeeRepository) { }

    async execute(filter: string): Promise<Employee[]> {
        return await this.employeeRepository.findByNameOrCpf(filter);
    }
}
