import { app } from "@/app";
import request from "supertest";
import { CategoryFactory } from "test/factories/category-factory";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Company create test(e2e)", () => {
    let categoryFactory: CategoryFactory;

    beforeAll(async () => {
        await app.ready();
        categoryFactory = new CategoryFactory();
    });

    afterAll(async () => {
        await app.close();
    });

    it.skip("should be able to create a company", async () => {
        const category = await categoryFactory.makeCategory();

        const response = await request(app.server).post("/company/add").send({
            user: {
                name: "testName",
                password: "Test123*",
                email: "test@example.com",
            },
            address: {
                lat: "3333333",
                lng: "2222222",
                description: "description",
            },
            socialName: "socialName",
            document: "document",
            phone: "88 888888888",
            employeeQuantity: 5,
            categoryId: category.id
        });

        expect(response.statusCode).toEqual(201);
        expect(response.body).toMatchObject({ companyId: expect.any(String) });
    });
});
