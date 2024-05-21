import { app } from "@/app";
import request from "supertest";
import { CategoryFactory } from "test/factories/category-factory";
import { CompanyFactory } from "test/factories/company-factory";
import { makeFakeUser } from "test/factories/user-factory";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Validate confirmation code test(e2e)", () => {
    let companyFactory: CompanyFactory;
    let categoryFactory: CategoryFactory;

    beforeAll(async () => {
        await app.ready();
        companyFactory = new CompanyFactory();
        categoryFactory = new CategoryFactory();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to confirmation code", async () => {
        const category = await categoryFactory.makeCategory();
        const user = makeFakeUser({ confirmationCode: "9A8B7C" });
        await companyFactory.makeCompany({ categoryId: category.id, user });

        const response = await request(app.server)
            .patch("/user/activate-account")
            .send({ confirmationCode: "9A8B7C", email: user.email });

        expect(response.statusCode).toEqual(200);
        expect(response.body).toMatchObject({ accessToken: expect.any(String) });
    });
});
