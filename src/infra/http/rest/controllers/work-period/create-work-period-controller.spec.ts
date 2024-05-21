import { app } from "@/app";
import { GenerateJwtUseCase } from "@/application/use-cases/auth/generate-jwt-use-case";
import { UserRoleEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { WeekdayEnum } from "@/domain/enum/week-day-enum";
import { AuthPayload } from "@/domain/interfaces/auth/auth-payload";
import request from "supertest";
import { CategoryFactory } from "test/factories/category-factory";
import { CompanyFactory } from "test/factories/company-factory";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Work period create test(e2e)", () => {
    let companyFactory: CompanyFactory;
    let categoryFactory: CategoryFactory;
    let generateJwt: GenerateJwtUseCase;

    beforeAll(async () => {
        await app.ready();
        companyFactory = new CompanyFactory();
        categoryFactory = new CategoryFactory();
        generateJwt = new GenerateJwtUseCase();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to create a work period", async () => {
        const category = await categoryFactory.makeCategory();
        const company = await companyFactory.makeCompany({ categoryId: category.id });

        const payload: AuthPayload = {
            companyId: company.id!,
            roles: UserRoleEnum.BASIC,
            type: UserTypesEnum.COMPANY,
        };

        const { accessToken } = await generateJwt.execute(payload);

        const response = await request(app.server).post("/work-period/add")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                workPeriod: {
                    workPeriods: [
                        {
                            name: "work period name",
                            day: WeekdayEnum.Friday,
                            startWorkHour: "2024-03-01T08:00:00.000Z",
                            startBreakHour: "2024-03-01T12:00:00.000Z",
                            finishedBreakHour: "2024-03-01T14:00:00.000Z",
                            finishedWorkHour: "2024-03-01T18:00:00.000Z"
                        }
                    ]
                }

            });

        expect(response.statusCode).toEqual(201);
        expect(response.body).toMatchObject({ codWorkPeriod: response.body.codWorkPeriod });
    });
});
