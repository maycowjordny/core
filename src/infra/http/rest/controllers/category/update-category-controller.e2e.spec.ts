import { app } from "@/app";
import request from "supertest";
import { CategoryFactory } from "test/factories/category-factory";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Category update test(e2e)", () => {
    let categoryFactory: CategoryFactory;
    beforeAll(async () => {
        categoryFactory = new CategoryFactory();
        await app.ready();

    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to create a category", async () => {
        const category = await categoryFactory.makeCategory({ name: "category" });

        const response = await request(app.server).put(`/category/${category.id}`)
            .send({ name: "category-update" });

        expect(response.statusCode).toEqual(200);
        expect(response.body).toMatchObject({ message: "Category update successfully!" });
    });
});
