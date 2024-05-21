import { app } from "@/app";
import { GenerateJwtUseCase } from "@/application/use-cases/auth/generate-jwt-use-case";
import { AccessMethodEnum, GenderEnum } from "@/domain/enum/employee-enum";
import { UserRoleEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { AuthPayload } from "@/domain/interfaces/auth/auth-payload";
import request from "supertest";
import { CategoryFactory } from "test/factories/category-factory";
import { CompanyFactory } from "test/factories/company-factory";
import { EmployeeFactory } from "test/factories/employee-factory";
import { UserFactory } from "test/factories/user-factory";
import { WorkPeriodFactory } from "test/factories/work-period-factory";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Employee update test(e2e)", () => {
    let companyFactory: CompanyFactory;
    let categoryFactory: CategoryFactory;
    let userFactory: UserFactory;
    let workPeriodFactory: WorkPeriodFactory;
    let employeeFactory: EmployeeFactory;
    let generateJwt: GenerateJwtUseCase;

    beforeAll(async () => {
        await app.ready();
        companyFactory = new CompanyFactory();
        employeeFactory = new EmployeeFactory();
        workPeriodFactory = new WorkPeriodFactory();
        userFactory = new UserFactory();
        categoryFactory = new CategoryFactory();
        generateJwt = new GenerateJwtUseCase();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to update a employee ", async () => {

        const category = await categoryFactory.makeCategory();
        const company = await companyFactory.makeCompany({ categoryId: category.id });
        const user = await userFactory.makeUser({ companyId: company.id });
        const workPeriod = await workPeriodFactory.makeWorkPeriod({ companyId: company.id });
        const employee = await employeeFactory.makeEmployee({ companyId: company.id, user, codWorkPeriod: workPeriod.codWorkPeriod });

        const payload: AuthPayload = {
            companyId: company.id!,
            roles: UserRoleEnum.BASIC,
            type: UserTypesEnum.COMPANY,
        };

        const { accessToken } = await generateJwt.execute(payload);

        const response = await request(app.server).put(`/employee/${employee.id}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                user: {
                    name: "testUpdate",
                    password: "Test123",
                    email: "update@example.com",
                    role: "BASIC",
                },
                document: "9999999",
                phone: "888888888",
                gender: GenderEnum.MALE,
                registerCode: "EMP125",
                isActive: true,
                hourlyWage: 10,
                birthDate: "1990-01-01",
                accessMethod: AccessMethodEnum.WEB_APP,
                initialDate: "2024-01-01",
                admissionDate: "2023-12-01",
                presence: false,
                office: "Manager",
            });

        expect(response.statusCode).toEqual(201);
        expect(response.body).toMatchObject({ message: "Employee update successfully!" });
    });
});
