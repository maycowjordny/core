import { app } from "@/app";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Category create test(e2e)", () => {

    beforeAll(async () => {
        await app.ready();

    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to create a category", async () => {
        const response = await request(app.server).post("/category/add").send({ name: "category" });

        expect(response.statusCode).toEqual(201);
        expect(response.body).toMatchObject({ categoryId: expect.any(String) });
    });
});
