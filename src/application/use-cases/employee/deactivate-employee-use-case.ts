import { Employee } from "@/domain/entities/employee-entity";
import { DeactivateEmployeeProps } from "@/domain/interfaces/employee";
import { PRISMA_NOT_FOUND_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { EmployeeRepository } from "@/infra/database/repositories/employee-repository";
import { DeactivateEmployeeException } from "./errors/deactive-employee-exception";
import { EmployeeNotFoundException } from "./errors/not-found-employee-exception";

export class DeactivateEmployeeUseCase {
    constructor(private employeeRepository: EmployeeRepository) { }

    async execute(employeeInput: DeactivateEmployeeProps): Promise<Employee> {
        try {
            const employeeDeactive: DeactivateEmployeeProps = {
                id: employeeInput.id,
                isActive: false,
                companyId: employeeInput.companyId,
            };

            return await this.employeeRepository.deactivate(employeeDeactive);
        } catch (err: any) {
            if (err.code == PRISMA_NOT_FOUND_EXCEPTION) {
                throw new EmployeeNotFoundException();
            }

            throw new DeactivateEmployeeException(err);
        }
    }
}
