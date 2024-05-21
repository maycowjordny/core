import { app } from "@/app";
import { hashPassword } from "@/utils/generate-hash";
import request from "supertest";
import { makeFakeAddress } from "test/factories/address-factory";
import { CategoryFactory } from "test/factories/category-factory";
import { CompanyFactory } from "test/factories/company-factory";
import { makeFakeUser } from "test/factories/user-factory";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Session create test(e2e)", () => {
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

    it("should be able to create a session", async () => {
        const category = await categoryFactory.makeCategory();
        const user = makeFakeUser({ password: await hashPassword("Test123"), email: "test@example" });
        const address = makeFakeAddress();
        await companyFactory.makeCompany({ categoryId: category.id, user, address });

        const response = await request(app.server)
            .post("/session")
            .send({
                email: "test@example",
                password: "Test123",
            })
            .expect(201);

        expect(response.statusCode).toEqual(201);
        expect(response.body).toMatchObject({ accessToken: expect.any(String) });
    });
});
