import { Employee } from "@/domain/entities/employee-entity";
import { Gender, Prisma } from "@prisma/client";
import { EmployeeMapper } from "./employee-mapper";

export class UpdateEmployeeMapper extends EmployeeMapper {
    static convertToPrisma(employee: Employee): Prisma.EmployeeUncheckedUpdateInput {
        return {
            document: employee.document,
            gender: employee.gender as Gender,
            office: employee.office,
            acessMethod: employee.accessMethod,
            phone: employee.phone,
            initialDate: employee.initialDate,
            birthDate: employee.birthDate,
            hourlyWage: employee.hourlyWage,
            registerCode: employee.birthDate,
            admissionDate: employee.admissionDate,
        };
    }
}
