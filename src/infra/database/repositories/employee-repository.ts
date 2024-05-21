import { Employee } from "@/domain/entities/employee-entity";
import { DeactivateEmployeeProps, EmployeeRequest, NearbyProps } from "@/domain/interfaces/employee";

export interface EmployeeRepository {
  create(employee: Employee): Promise<Employee>;
  findById(id: string): Promise<Employee | null>;
  findByUserId(userId: string): Promise<Employee | null>;
  findByNameOrCpf(filter: string): Promise<Employee[]>;
  findLocationById(employeeId: string): Promise<NearbyProps | null>;
  findManyByCompany({ companyId, pagination: { page, take } }: EmployeeRequest): Promise<Employee[]>;
  deactivate(data: DeactivateEmployeeProps): Promise<Employee>;
  update(employee: Employee): Promise<Employee>;
}
