import { Employee } from "@/domain/entities/employee-entity";
import { User } from "@/domain/entities/user-entity";
import { EmployeeRepository } from "@/infra/database/repositories/employee-repository";
import { hashPassword } from "@/utils/generate-hash";
import { CreateEmployeeException } from "./errors/create-employee-exception";

export class CreateEmployeeUseCase {
    constructor(private employeeRepository: EmployeeRepository) { }

    async execute(employeeInput: Employee): Promise<Employee> {
        try {
            const createUser = new User({
                ...employeeInput.user!.props,
                password: await hashPassword(employeeInput.user!.password),
            });

            const newEmployee = new Employee({
                ...employeeInput.props,
                user: createUser
            });

            return await this.employeeRepository.create(newEmployee);
        } catch (err: any) {

            throw new CreateEmployeeException(err);
        }
    }
}
