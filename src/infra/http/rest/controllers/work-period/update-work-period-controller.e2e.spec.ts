import { app } from "@/app";
import { GenerateJwtUseCase } from "@/application/use-cases/auth/generate-jwt-use-case";
import { UserRoleEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { WeekdayEnum } from "@/domain/enum/week-day-enum";
import { AuthPayload } from "@/domain/interfaces/auth/auth-payload";
import request from "supertest";
import { CategoryFactory } from "test/factories/category-factory";
import { CompanyFactory } from "test/factories/company-factory";
import { EmployeeFactory } from "test/factories/employee-factory";
import { UserFactory } from "test/factories/user-factory";
import { WorkPeriodFactory } from "test/factories/work-period-factory";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("WorkPeriodRegister update test(e2e)", () => {
    let categoryFactory: CategoryFactory;
    let companyFactory: CompanyFactory;
    let userFactory: UserFactory;
    let employeeFactory: EmployeeFactory;
    let workPeriodFactory: WorkPeriodFactory;
    let generateJwt: GenerateJwtUseCase;

    beforeAll(async () => {
        await app.ready();
        categoryFactory = new CategoryFactory();
        companyFactory = new CompanyFactory();
        userFactory = new UserFactory();
        employeeFactory = new EmployeeFactory();
        workPeriodFactory = new WorkPeriodFactory();
        generateJwt = new GenerateJwtUseCase();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to update a work period", async () => {
        const category = await categoryFactory.makeCategory();
        const company = await companyFactory.makeCompany({ categoryId: category.id });
        const user = await userFactory.makeUser({ companyId: company.id });
        const workPeriod = await workPeriodFactory.makeWorkPeriod({ companyId: company.id });

        await employeeFactory.makeEmployee({ companyId: company.id, user, codWorkPeriod: workPeriod.codWorkPeriod });

        const payload: AuthPayload = {
            companyId: company.id!,
            roles: UserRoleEnum.BASIC,
            type: UserTypesEnum.COMPANY,
        };

        const { accessToken } = await generateJwt.execute(payload);

        const response = await request(app.server).put(`/work-period/${workPeriod.codWorkPeriod}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                workPeriod: {
                    workPeriods: [
                        {
                            name: "work period name",
                            day: WeekdayEnum.Monday,
                            startWorkHour: "2024-03-01T08:00:00.000Z",
                            startBreakHour: "2024-03-01T12:00:00.000Z",
                            finishedBreakHour: "2024-03-01T14:00:00.000Z",
                            finishedWorkHour: "2024-03-01T18:00:00.000Z"
                        }
                    ]
                }
            });

        expect(response.statusCode).toEqual(200);
        expect(response.body).toMatchObject({ message: "WorkPeriod update successfully!" });
    });
});
