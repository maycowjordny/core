import { app } from "@/app";
import { GenerateJwtUseCase } from "@/application/use-cases/auth/generate-jwt-use-case";
import { TypeAbsenceEnum } from "@/domain/enum/absence-enum";
import { UserRoleEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { AuthPayload } from "@/domain/interfaces/auth/auth-payload";
import request from "supertest";
import { CategoryFactory } from "test/factories/category-factory";
import { CompanyFactory } from "test/factories/company-factory";
import { EmployeeFactory } from "test/factories/employee-factory";
import { UserFactory } from "test/factories/user-factory";
import { WorkPeriodFactory } from "test/factories/work-period-factory";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Absence create test(e2e)", () => {
    let companyFactory: CompanyFactory;
    let categoryFactory: CategoryFactory;
    let userFactory: UserFactory;
    let workPeriodFactory: WorkPeriodFactory;
    let employeeFactory: EmployeeFactory;
    let generateJwt: GenerateJwtUseCase;

    beforeAll(async () => {
        await app.ready();
        companyFactory = new CompanyFactory();
        workPeriodFactory = new WorkPeriodFactory();
        employeeFactory = new EmployeeFactory();
        userFactory = new UserFactory();
        categoryFactory = new CategoryFactory();
        generateJwt = new GenerateJwtUseCase();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to create a absence ", async () => {
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

        const response = await request(app.server).post("/absence/add")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                type: TypeAbsenceEnum.ABSENCE,
                description: "description",
                initialDate: new Date("11/04/2024"),
                endDate: new Date("11/04/2024"),
                employeeId: employee.id
            });

        expect(response.statusCode).toEqual(201);
        expect(response.body).toMatchObject({ absenceId: expect.any(String) });
    });
});
