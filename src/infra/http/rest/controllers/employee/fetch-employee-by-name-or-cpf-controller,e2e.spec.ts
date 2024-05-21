import { app } from "@/app";
import { GenerateJwtUseCase } from "@/application/use-cases/auth/generate-jwt-use-case";
import { UserRoleEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { AuthPayload } from "@/domain/interfaces/auth/auth-payload";
import request from "supertest";
import { CategoryFactory } from "test/factories/category-factory";
import { CompanyFactory } from "test/factories/company-factory";
import { EmployeeFactory } from "test/factories/employee-factory";
import { UserFactory } from "test/factories/user-factory";
import { WorkPeriodFactory } from "test/factories/work-period-factory";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Fetch employee by name or cpf test(e2e)", () => {
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

    it("should be able to fetch a employee by cpf or name", async () => {

        const category = await categoryFactory.makeCategory();
        const company = await companyFactory.makeCompany({ categoryId: category.id });
        const user = await userFactory.makeUser({ companyId: company.id, name: "testName" });
        const workPeriod = await workPeriodFactory.makeWorkPeriod({ companyId: company.id });
        await employeeFactory.makeEmployee({ companyId: company.id, document: "test", user, codWorkPeriod: workPeriod.codWorkPeriod });

        const payload: AuthPayload = {
            companyId: company.id!,
            roles: UserRoleEnum.BASIC,
            type: UserTypesEnum.COMPANY,
        };

        const { accessToken } = await generateJwt.execute(payload);

        const response = await request(app.server).get("/employee/search")
            .set("Authorization", `Bearer ${accessToken}`)
            .query({ document: "test" })
            .query({ name: "testName" })
            .send();

        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveLength(1);
    });
});
