import { Employee } from "@/domain/entities/employee-entity";
import { Gender, Prisma } from "@prisma/client";
import { EmployeeMapper } from "./employee-mapper";

export class CreateEmployeeMapper extends EmployeeMapper {
    static convertToPrisma(employee: Employee): Prisma.EmployeeCreateInput {
        return {
            document: employee.document,
            gender: employee.gender as Gender,
            company: { connect: { id: employee.companyId } },
            office: employee.office,
            codWorkPeriod: employee.codWorkPeriod,
            user: { connect: { id: employee.user!.id } },
            nisPis: employee.nisPis,
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
