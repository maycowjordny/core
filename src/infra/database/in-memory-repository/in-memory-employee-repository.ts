import { Employee } from "@/domain/entities/employee-entity";
import { DeactivateEmployeeProps, EmployeeRequest, NearbyProps } from "@/domain/interfaces/employee";
import { EmployeeRepository } from "../repositories/employee-repository";

export class InMemoryEmployeeRepository implements EmployeeRepository {
    public items: Employee[] = [];

    async create(employee: Employee): Promise<Employee> {
        this.items.push(employee);

        return employee;
    }

    async findById(id: string): Promise<Employee | null> {
        const employee = this.items.find((data) => data.id == id);

        if (!employee) return null;

        return employee;
    }

    async findLocationById(employeeId: string): Promise<NearbyProps | null> {
        const employee = this.items.find((data) => data.id === employeeId);

        if (!employee) {
            return null;
        }

        const company = {
            id: "simulatedCompanyId",
            socialName: "socialName",
            document: "document",
            phone: "88 88888888",
            employeeQuantity: 2,
            address: {
                id: "simulatedAddressId",
                description: "description",
                lat: "41.7128",
                lng: "-74.0060",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            category: {
                id: "categoryId-01"
            }
        };

        const simulatedResult = {
            company: {
                address: {
                    lat: company.address.lat,
                    lng: company.address.lng,
                },
                id: "simulatedCompanyId",
                user: employee.user!,
                addressId: company.address.id,
                categoryId: "categoryId-01",
                socialName: "socialName",
                document: company.document,
                phone: company.phone,
                employeeQuantity: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        };

        return simulatedResult;
    }

    async update(employee: Employee): Promise<Employee> {
        const employees = this.items.filter((item) => item.id == employee.id)[0];

        const newEmployee = new Employee({
            ...employees.props,
            document: employee.document,
            presence: employee.presence,
            gender: employee.gender,
            office: employee.office,
            accessMethod: employee.accessMethod,
            initialDate: employee.initialDate,
        });

        return newEmployee;
    }

    async findByNameOrCpf(filter: string): Promise<Employee[]> {
        return this.items.filter((employee) => employee.document.includes(filter));
    }

    async deactivate(data: DeactivateEmployeeProps): Promise<Employee> {
        const employees = this.items.filter((item) => item.id == data.id && item.companyId == data.companyId)[0];

        const newEmployee = new Employee({
            ...employees.props,
            isActive: data.isActive!
        });

        return newEmployee;
    }

    async findManyByCompany({ companyId, pagination: { page, take } }: EmployeeRequest): Promise<Employee[]> {
        const employees = this.items.filter(item => item.companyId == companyId);

        return employees.slice((page - 1) * take, page * take);
    }

    async findByUserId(userId: string): Promise<Employee | null> {
        const employee = this.items.find(item => item.user?.id == userId);

        if (!employee) return null;

        return employee;
    }
}

