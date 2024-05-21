import { Employee, EmployeeProps } from "@/domain/entities/employee-entity";
import { User } from "@/domain/entities/user-entity";
import { AccessMethodEnum, GenderEnum } from "@/domain/enum/employee-enum";
import { prisma } from "@/infra/database/lib/prisma";
import { CreateEmployeeMapper } from "@/infra/database/prisma/mappers/employee/create-employee-mapper";
import { EmployeeMapper } from "@/infra/database/prisma/mappers/employee/employee-mapper";
import { faker } from "@faker-js/faker";
import { makeFakeUser } from "./user-factory";

type EmployeeOverrides = {
    id?: string;
    user?: User;
    companyId?: string;
    isActive?: boolean;
    gender?: string;
    codWorkPeriod?: string;
    document?: string;
    accessMethod?: AccessMethodEnum;
    admissionDate?: string;
    birthDate?: string;
    hourlyWage?: number;
    phone?: string;
    nisPis?: string | null;
    registerCode?: string;
    initialDate?: string;
    presence?: boolean;
    office?: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export function makeFakeEmployee(data = {} as EmployeeOverrides) {
    const office = faker.person.jobArea();
    const document = faker.string.numeric("88888888888");
    const initialDate = faker.date.future().toDateString();
    const admissionDate = faker.date.anytime();
    const birthDate = faker.date.anytime();
    const hourlyWage = faker.number.float();
    const phone = faker.phone.number();
    const registerCode = faker.string.numeric();
    const codWorkPeriod = faker.string.numeric();
    const user = makeFakeUser({ id: "userId-01" });

    const props: EmployeeProps = {
        id: data.id ?? "",
        companyId: data.companyId || "",
        codWorkPeriod: data.codWorkPeriod || codWorkPeriod,
        isActive: data.isActive ? data.isActive : true,
        admissionDate: data.admissionDate || admissionDate.toDateString(),
        birthDate: data.birthDate || birthDate.toDateString(),
        hourlyWage: data.hourlyWage || hourlyWage,
        nisPis: data.nisPis ?? null,
        phone: data.phone || phone,
        registerCode: data.registerCode || registerCode,
        user: data.user || user,
        document: data.document || document,
        accessMethod: data.accessMethod || AccessMethodEnum.WEB,
        gender: data.gender || GenderEnum.MALE,
        office: data.office || office,
        initialDate: data.initialDate || initialDate,
        presence: data.presence ? data.presence : true,
    };

    const employee = Employee.create(props);

    return employee;
}

export class EmployeeFactory {
    constructor() { }

    async makeEmployee(data = {} as EmployeeOverrides): Promise<Employee> {
        const employee = makeFakeEmployee(data);
        (employee.user);

        const result = await prisma.employee.create({
            data: CreateEmployeeMapper.convertToPrisma(employee)
        });

        return EmployeeMapper.toDomain(result);
    }
}
