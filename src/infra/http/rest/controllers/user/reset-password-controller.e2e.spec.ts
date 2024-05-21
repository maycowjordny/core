import { app } from "@/app";
import request from "supertest";
import { CategoryFactory } from "test/factories/category-factory";
import { CompanyFactory } from "test/factories/company-factory";
import { UserFactory } from "test/factories/user-factory";
import { token } from "test/jwt/constants";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("jsonwebtoken", () => ({
    sign: vi.fn(() => token),
    verify: vi.fn((token) => {
        token;
    }),
}));

describe("Reset password test(e2e)", () => {
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

    it("should be able to reset password", async () => {
        const category = await categoryFactory.makeCategory();
        const company = await companyFactory.makeCompany({ categoryId: category.id });

        const user = await userFactory.makeUser({ companyId: company.id, email: "test@example.com", resetToken: token });

        const response = await request(app.server).patch("/user/reset-password")
            .send({
                email: user.email,
                newPassword: "Test321*",
                token: user.resetToken,
            });

        expect(response.statusCode).toEqual(200);
        expect(response.body).toMatchObject({ message: "Password update sucessfuly!" });
    });
});
