import { app } from "@/app";
import { GenerateJwtUseCase } from "@/application/use-cases/auth/generate-jwt-use-case";
import { UserRoleEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { AuthPayload } from "@/domain/interfaces/auth/auth-payload";
import request from "supertest";
import { AddressFactory } from "test/factories/address-factory";
import { CategoryFactory } from "test/factories/category-factory";
import { CompanyFactory } from "test/factories/company-factory";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Address update test(e2e)", () => {
    let companyFactory: CompanyFactory;
    let categoryFactory: CategoryFactory;
    let addressFactory: AddressFactory;
    let generateJwt: GenerateJwtUseCase;

    beforeAll(async () => {
        await app.ready();
        companyFactory = new CompanyFactory();
        addressFactory = new AddressFactory();
        categoryFactory = new CategoryFactory();
        generateJwt = new GenerateJwtUseCase();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to update an address", async () => {
        const category = await categoryFactory.makeCategory();
        const company = await companyFactory.makeCompany({ categoryId: category.id });
        const address = await addressFactory.makeAddress();

        const payload: AuthPayload = {
            companyId: company.id!,
            roles: UserRoleEnum.ADMIN,
            type: UserTypesEnum.COMPANY,
        };

        const { accessToken } = await generateJwt.execute(payload);

        const response = await request(app.server).put(`/address/${address.id}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                lat: "888888",
                lng: "888888",
                description: "new description"
            });

        expect(response.statusCode).toEqual(200);
        expect(response.body).toMatchObject({ message: "Address update successfully!" });
    });
});
