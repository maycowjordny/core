import { app } from "@/app";
import { GenerateJwtUseCase } from "@/application/use-cases/auth/generate-jwt-use-case";
import { AccessMethodEnum, GenderEnum } from "@/domain/enum/employee-enum";
import { UserRoleEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { AuthPayload } from "@/domain/interfaces/auth/auth-payload";
import request from "supertest";
import { CategoryFactory } from "test/factories/category-factory";
import { CompanyFactory } from "test/factories/company-factory";
import { WorkPeriodFactory } from "test/factories/work-period-factory";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Employee create test(e2e)", () => {
    let companyFactory: CompanyFactory;
    let workPeriodFactory: WorkPeriodFactory;
    let categoryFactory: CategoryFactory;
    let generateJwt: GenerateJwtUseCase;

    beforeAll(async () => {
        await app.ready();
        companyFactory = new CompanyFactory();
        workPeriodFactory = new WorkPeriodFactory();
        categoryFactory = new CategoryFactory();
        generateJwt = new GenerateJwtUseCase();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to create a employee ", async () => {

        const category = await categoryFactory.makeCategory();
        const company = await companyFactory.makeCompany({ categoryId: category.id, });
        const workPeriod = await workPeriodFactory.makeWorkPeriod({ companyId: company.id });

        const payload: AuthPayload = {
            companyId: company.id!,
            roles: UserRoleEnum.BASIC,
            type: UserTypesEnum.COMPANY,
        };

        const { accessToken } = await generateJwt.execute(payload);

        const response = await request(app.server).post("/employee/add")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                user: {
                    name: "test",
                    password: "Test123*",
                    email: "test@example.com",
                },
                codWorkPeriod: workPeriod.codWorkPeriod,
                document: "123456789",
                phone: "987654321",
                gender: GenderEnum.MALE,
                registerCode: "EMP123",
                hourlyWage: 20,
                birthDate: "1990-01-01",
                accessMethod: AccessMethodEnum.WEB,
                initialDate: "2024-01-01",
                admissionDate: "2023-12-01",
                presence: true,
                office: "Manager",
            });

        expect(response.statusCode).toEqual(201);
        expect(response.body).toMatchObject({ employeeId: expect.any(String) });
    });
});
