import { Employee } from "@/domain/entities/employee-entity";
import { EmployeeRepository } from "@/infra/database/repositories/employee-repository";

export class FindEmployeeByIdUseCase {
    constructor(private employeeRepository: EmployeeRepository) { }

    async execute(id: string): Promise<Employee | null> {
        return await this.employeeRepository.findById(id);
    }
}
