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
import { WorkPeriodRegisterFactory } from "test/factories/work-period-register-factory";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Determine employee pay summary test(e2e)", () => {
    let companyFactory: CompanyFactory;
    let categoryFactory: CategoryFactory;
    let userFactory: UserFactory;
    let employeeFactory: EmployeeFactory;
    let workPeriodFactory: WorkPeriodFactory;
    let workPeriodRegisterFactory: WorkPeriodRegisterFactory;
    let generateJwt: GenerateJwtUseCase;

    beforeAll(async () => {
        await app.ready();
        categoryFactory = new CategoryFactory();
        companyFactory = new CompanyFactory();
        employeeFactory = new EmployeeFactory();
        workPeriodFactory = new WorkPeriodFactory();
        workPeriodRegisterFactory = new WorkPeriodRegisterFactory();
        userFactory = new UserFactory();
        generateJwt = new GenerateJwtUseCase();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to determine employee pay summary", async () => {
        const category = await categoryFactory.makeCategory();
        const company = await companyFactory.makeCompany({ categoryId: category.id });
        const user = await userFactory.makeUser({ companyId: company.id });
        const workPeriod = await workPeriodFactory.makeWorkPeriod({ companyId: company.id });
        const employee = await employeeFactory.makeEmployee({ companyId: company.id, user, codWorkPeriod: workPeriod.codWorkPeriod, hourlyWage: 5, nisPis: "121212" });

        for (let i = 1; i <= 26; i++) {
            const day = i.toString().padStart(2, "0");
            await workPeriodRegisterFactory.makeWorkPeriodRegister({ employeeId: employee.id, workPeriodId: workPeriod.id, createdAt: new Date(`2024-03-${day}T08:00:00.000Z`) });

        }

        const payload: AuthPayload = {
            companyId: company.id!,
            roles: UserRoleEnum.BASIC,
            type: UserTypesEnum.COMPANY,
        };

        const { accessToken } = await generateJwt.execute(payload);

        const response = await request(app.server).get(`/employee/summary-salary/${employee.id}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .query({ startDate: "2024-03-01T08:00:00.000Z" })
            .query({ endDate: "2024-03-30T08:00:00.000Z" })
            .send();

        expect(response.statusCode).toEqual(200);
    });
});
