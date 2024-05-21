import { Employee } from "@/domain/entities/employee-entity";
import { AccessMethodEnum } from "@/domain/enum/employee-enum";
import { Prisma, Employee as RawEmployee, User } from "@prisma/client";
import { UserMapper } from "../user/user-mapper";
export class EmployeeMapper {
    static toDomain(raw: RawEmployee): Employee {
        return new Employee({
            id: raw.id,
            document: raw.document,
            gender: raw.gender,
            companyId: raw.companyId,
            codWorkPeriod: raw.codWorkPeriod!,
            office: raw.office,
            accessMethod: raw.acessMethod as AccessMethodEnum,
            isActive: raw.isActive,
            nisPis: raw.nisPis,
            presence: raw.presence,
            initialDate: raw.initialDate,
            createdAt: raw.createdAt,
            phone: raw.phone,
            registerCode: raw.registerCode,
            hourlyWage: raw.hourlyWage,
            birthDate: raw.birthDate,
            admissionDate: raw.admissionDate,
        });
    }

    static toDomainCreateEmployeeAndUser(raw: Prisma.EmployeeGetPayload<{ include: { company: true } }>, user: User): Employee {
        return new Employee({
            id: raw.id,
            document: raw.document,
            gender: raw.gender,
            office: raw.office,
            companyId: raw.company.id,
            nisPis: raw.nisPis,
            user: UserMapper.toDomain(user),
            accessMethod: raw.acessMethod as AccessMethodEnum,
            presence: raw.presence,
            isActive: raw.isActive,
            initialDate: raw.initialDate,
            createdAt: raw.createdAt,
            phone: raw.phone,
            registerCode: raw.registerCode,
            hourlyWage: raw.hourlyWage,
            birthDate: raw.birthDate,
            admissionDate: raw.admissionDate,
        });
    }
}

