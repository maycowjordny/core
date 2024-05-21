import { Employee } from "@/domain/entities/employee-entity";
import { User } from "@/domain/entities/user-entity";
import { DeactivateEmployeeProps, EmployeeRequest, NearbyProps } from "@/domain/interfaces/employee";
import { prisma } from "../../lib/prisma";
import { EmployeeRepository } from "../../repositories/employee-repository";
import { EmployeeAddressMapper } from "../mappers/employee/check-nearby-employee-mapper";
import { CreateEmployeeMapper } from "../mappers/employee/create-employee-mapper";
import { DeactivateEmployeeMapper } from "../mappers/employee/deactivate-employee-mapper";
import { EmployeeMapper } from "../mappers/employee/employee-mapper";
import { UpdateEmployeeMapper } from "../mappers/employee/update-employee-mapper";
import { CreateUserMapper } from "../mappers/user/create-user-mapper";
import { UserMapper } from "../mappers/user/user-mapper";

export class PrismaEmployeeRepository implements EmployeeRepository {
    async create(employee: Employee): Promise<Employee> {
        const result = await prisma.$transaction(async (tx) => {
            const createUserEntity = new User({
                ...employee.user!.props,
                id: employee.user!.id,
                companyId: employee.companyId
            });

            const createUser = await tx.user.create({
                data: CreateUserMapper.convertToPrisma(createUserEntity)
            });

            const createEmployeeEntity = new Employee({
                ...employee.props,
                user: UserMapper.toDomain(createUser),
            });

            const createEmployee = await tx.employee.create({
                data: CreateEmployeeMapper.convertToPrisma(createEmployeeEntity),
                include: {
                    company: true
                }
            });

            return { employee: createEmployee, user: createUser };
        });

        return EmployeeMapper.toDomainCreateEmployeeAndUser(result.employee, result.user);
    }

    async findById(id: string): Promise<Employee | null> {
        const employee = await prisma.employee.findUnique({
            where: {
                id,
            },
        });

        return employee && EmployeeMapper.toDomain(employee);
    }

    async deactivate(data: DeactivateEmployeeProps): Promise<Employee> {
        const result = await prisma.employee.update({
            where: {
                id: data.id,
                companyId: data.companyId
            },
            data: DeactivateEmployeeMapper.convertToPrisma(data)
        });

        return EmployeeMapper.toDomain(result);
    }

    async findByNameOrCpf(filter: string): Promise<Employee[]> {
        const employee = await prisma.employee.findMany({
            where: {
                OR: [
                    { document: filter },
                    {
                        user: {
                            name: { contains: filter },
                        },
                    },
                ],
            },
        });

        return employee.map(EmployeeMapper.toDomain);
    }

    async update(employee: Employee): Promise<Employee> {
        const result = await prisma.employee.update({
            where: {
                id: employee.id,
                companyId: employee.companyId
            },
            data: UpdateEmployeeMapper.convertToPrisma(employee)
        });
        return EmployeeMapper.toDomain(result);
    }

    async findLocationById(employeeId: string): Promise<NearbyProps | null> {
        const result = await prisma.employee.findFirst({
            include: {
                company: {
                    include: {
                        address: {
                            select: {
                                lat: true,
                                lng: true
                            }
                        }
                    }
                }
            },
            where: {
                id: employeeId
            }
        });

        return result && EmployeeAddressMapper.toDomain(result);
    }

    async findManyByCompany({ companyId, pagination: { page, take } }: EmployeeRequest): Promise<Employee[]> {
        const result = await prisma.employee.findMany({
            where: {
                companyId
            },
            skip: (page - 1) * take,
            take,
        });

        return result.map(EmployeeMapper.toDomain);
    }

    async findByUserId(userId: string): Promise<Employee | null> {
        const employee = await prisma.employee.findUnique({
            where: {
                userId
            }
        });

        return employee && EmployeeMapper.toDomain(employee);
    }
}

