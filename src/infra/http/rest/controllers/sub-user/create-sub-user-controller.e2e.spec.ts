import { app } from "@/app";
import { GenerateJwtUseCase } from "@/application/use-cases/auth/generate-jwt-use-case";
import { UserRoleEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { AuthPayload } from "@/domain/interfaces/auth/auth-payload";
import request from "supertest";
import { CategoryFactory } from "test/factories/category-factory";
import { CompanyFactory } from "test/factories/company-factory";
import { UserFactory } from "test/factories/user-factory";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("SubUser create test(e2e)", () => {
    let companyFactory: CompanyFactory;
    let categoryFactory: CategoryFactory;
    let userFactory: UserFactory;
    let generateJwt: GenerateJwtUseCase;

    beforeAll(async () => {
        await app.ready();
        companyFactory = new CompanyFactory();
        userFactory = new UserFactory();
        categoryFactory = new CategoryFactory();
        generateJwt = new GenerateJwtUseCase();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to create a subUser", async () => {

        const category = await categoryFactory.makeCategory();
        const company = await companyFactory.makeCompany({ categoryId: category.id });
        await userFactory.makeUser({ companyId: company.id });

        const payload: AuthPayload = {
            companyId: company.id!,
            roles: UserRoleEnum.ADMIN,
            type: UserTypesEnum.COMPANY,
        };

        const { accessToken } = await generateJwt.execute(payload);

        const response = await request(app.server).post("/sub-user/add")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "test",
                password: "Test123*",
                email: "test@example.com",
            });

        expect(response.statusCode).toEqual(201);
        expect(response.body).toMatchObject({ subUserId: expect.any(String) });
    });
});
