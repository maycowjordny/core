import { app } from "@/app";
import request from "supertest";
import { CategoryFactory } from "test/factories/category-factory";
import { CompanyFactory } from "test/factories/company-factory";
import { UserFactory } from "test/factories/user-factory";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Forgot password test(e2e)", () => {
    let companyFactory: CompanyFactory;
    let categoryFactory: CategoryFactory;
    let userFactory: UserFactory;

    beforeAll(async () => {
        await app.ready();
        companyFactory = new CompanyFactory();
        userFactory = new UserFactory();
        categoryFactory = new CategoryFactory();
    });

    afterAll(async () => {
        await app.close();
    });

    it.skip("should be able to recover the password", async () => {
        const category = await categoryFactory.makeCategory();
        const company = await companyFactory.makeCompany({ categoryId: category.id });
        const user = await userFactory.makeUser({ companyId: company.id });

        const response = await request(app.server).post("/user/forgot-password")
            .send({ email: user.email });

        expect(response.statusCode).toEqual(200);
        expect(response.body).toMatchObject({ message: "A password reset email has been sent, please check your inbox." });
    });
});
