import { app } from "@/app";
import { GenerateJwtUseCase } from "@/application/use-cases/auth/generate-jwt-use-case";
import { UserRoleEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { AuthPayload } from "@/domain/interfaces/auth/auth-payload";
import request from "supertest";
import { makeFakeAddress } from "test/factories/address-factory";
import { CategoryFactory } from "test/factories/category-factory";
import { CompanyFactory } from "test/factories/company-factory";
import { EmployeeFactory } from "test/factories/employee-factory";
import { UserFactory } from "test/factories/user-factory";
import { WorkPeriodFactory } from "test/factories/work-period-factory";
import { WorkPeriodRegisterFactory } from "test/factories/work-period-register-factory";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Work period register update test(e2e)", () => {
    let companyFactory: CompanyFactory;
    let categoryFactory: CategoryFactory;
    let userFactory: UserFactory;
    let employeeFactory: EmployeeFactory;
    let workPeriodFactory: WorkPeriodFactory;
    let workPeriodRegisterFactory: WorkPeriodRegisterFactory;
    let generateJwt: GenerateJwtUseCase;

    beforeAll(async () => {
        await app.ready();
        categoryFactory = new CategoryFactory();
        companyFactory = new CompanyFactory();
        employeeFactory = new EmployeeFactory();
        workPeriodFactory = new WorkPeriodFactory();
        workPeriodRegisterFactory = new WorkPeriodRegisterFactory();
        userFactory = new UserFactory();
        generateJwt = new GenerateJwtUseCase();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to update a work period register", async () => {
        const category = await categoryFactory.makeCategory();
        const address = makeFakeAddress({ lat: "34.0522", lng: "-118.2437" });
        const company = await companyFactory.makeCompany({ address, categoryId: category.id });
        const user = await userFactory.makeUser({ companyId: company.id });
        const workPeriod = await workPeriodFactory.makeWorkPeriod({ companyId: company.id });
        const employee = await employeeFactory.makeEmployee({ companyId: company.id, user, codWorkPeriod: workPeriod.codWorkPeriod });
        const workPeriodRegister = await workPeriodRegisterFactory.makeWorkPeriodRegister({ employeeId: employee.id });

        const payload: AuthPayload = {
            companyId: company.id!,
            sub: user.id,
            roles: UserRoleEnum.BASIC,
            type: UserTypesEnum.EMPLOYEE,
        };

        const { accessToken } = await generateJwt.execute(payload);

        const response = await request(app.server).put(`/work-period-register/${workPeriodRegister.id}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                workPeriodId: workPeriod.id,
                startWorkHour: "2024-03-01T08:00:00.000Z",
                startBreakHour: "2024-03-01T12:00:00.000Z",
                finishedBreakHour: "2024-03-01T14:00:00.000Z",
                finishedWorkHour: "2024-03-01T18:00:00.000Z",
                lat: "34.0522",
                lng: "-118.2437",
            });

        expect(response.statusCode).toEqual(200);
        expect(response.body).toMatchObject({ workPeriodRegisterId: expect.any(String) });
    });
});
