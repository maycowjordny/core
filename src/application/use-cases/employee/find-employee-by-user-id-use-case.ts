import { Employee } from "@/domain/entities/employee-entity";
import { EmployeeRepository } from "@/infra/database/repositories/employee-repository";

export class FindEmployeeByUserIdUseCase {
    constructor(private employeeRepository: EmployeeRepository) { }

    async execute(id: string): Promise<Employee | null> {
        return await this.employeeRepository.findByUserId(id);
    }
}
