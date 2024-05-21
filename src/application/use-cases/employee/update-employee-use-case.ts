import { Employee } from "@/domain/entities/employee-entity";
import { PRISMA_NOT_FOUND_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { EmployeeRepository } from "@/infra/database/repositories/employee-repository";
import { EmployeeNotFoundException } from "./errors/not-found-employee-exception";
import { UpdateEmployeeException } from "./errors/update-employee-exception";

export class UpdateEmployeeUseCase {
    constructor(private employeeRepository: EmployeeRepository) { }

    async execute(employeeInput: Employee): Promise<Employee> {
        try {

            return await this.employeeRepository.update(employeeInput);
        } catch (err: any) {
            if (err.code == PRISMA_NOT_FOUND_EXCEPTION) {
                throw new EmployeeNotFoundException();
            }

            throw new UpdateEmployeeException(err);
        }
    }
}
