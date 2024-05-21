import { app } from "@/app";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Category fetch test(e2e)", () => {

    beforeAll(async () => {
        await app.ready();

    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to fetch a category", async () => {
        const response = await request(app.server).get("/category").send();

        expect(response.statusCode).toEqual(200);
    });
});
