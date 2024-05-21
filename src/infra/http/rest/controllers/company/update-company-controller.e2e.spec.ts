import { app } from "@/app";
import { GenerateJwtUseCase } from "@/application/use-cases/auth/generate-jwt-use-case";
import { UserRoleEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { AuthPayload } from "@/domain/interfaces/auth/auth-payload";
import request from "supertest";
import { CategoryFactory } from "test/factories/category-factory";
import { CompanyFactory } from "test/factories/company-factory";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Employee update test(e2e)", () => {
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

    it("should be able to update a company", async () => {
        const category = await categoryFactory.makeCategory();
        const company = await companyFactory.makeCompany({ categoryId: category.id });

        const payload: AuthPayload = {
            companyId: company.id!,
            roles: UserRoleEnum.ADMIN,
            type: UserTypesEnum.COMPANY,
        };

        const { accessToken } = await generateJwt.execute(payload);

        const response = await request(app.server).put(`/company/${company.id}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                socialName: "socialName",
                document: "document",
                phone: "88 888888888",
                employeeQuantity: 5,
                categoryId: category.id
            });

        expect(response.statusCode).toEqual(200);
        expect(response.body).toMatchObject({ message: "Company update successfully!" });
    });
});
