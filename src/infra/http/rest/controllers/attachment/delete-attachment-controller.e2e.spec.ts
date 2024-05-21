import { app } from "@/app";
import { GenerateJwtUseCase } from "@/application/use-cases/auth/generate-jwt-use-case";
import { UserRoleEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { AuthPayload } from "@/domain/interfaces/auth/auth-payload";
import request from "supertest";
import { AbsenceFactory } from "test/factories/absence-factory";
import { CategoryFactory } from "test/factories/category-factory";
import { CompanyFactory } from "test/factories/company-factory";
import { EmployeeFactory } from "test/factories/employee-factory";
import { UserFactory } from "test/factories/user-factory";
import { WorkPeriodFactory } from "test/factories/work-period-factory";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Attachment delete test(e2e)", () => {
    let companyFactory: CompanyFactory;
    let categoryFactory: CategoryFactory;
    let userFactory: UserFactory;
    let employeeFactory: EmployeeFactory;
    let workPeriodFactory: WorkPeriodFactory;
    let absenceFactory: AbsenceFactory;
    let generateJwt: GenerateJwtUseCase;

    beforeAll(async () => {
        await app.ready();
        companyFactory = new CompanyFactory();
        employeeFactory = new EmployeeFactory();
        absenceFactory = new AbsenceFactory();
        workPeriodFactory = new WorkPeriodFactory();
        userFactory = new UserFactory();
        categoryFactory = new CategoryFactory();
        generateJwt = new GenerateJwtUseCase();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to delete an attachment", async () => {
        const category = await categoryFactory.makeCategory();
        const company = await companyFactory.makeCompany({ categoryId: category.id });
        const user = await userFactory.makeUser({ companyId: company.id });
        const workPeriod = await workPeriodFactory.makeWorkPeriod({ companyId: company.id });
        const employee = await employeeFactory.makeEmployee({ companyId: company.id, user, codWorkPeriod: workPeriod.codWorkPeriod });
        const absence = await absenceFactory.makeAbsence({ employeeId: employee.id, companyId: company.id });

        const payload: AuthPayload = {
            companyId: company.id!,
            roles: UserRoleEnum.BASIC,
            type: UserTypesEnum.COMPANY,
        };

        const { accessToken } = await generateJwt.execute(payload);

        const attachment = await request(app.server).post(`/absence/${absence.id}/attachment`)
            .set("Authorization", `Bearer ${accessToken}`)
            .set("Content-type", "multipart/form-data")
            .attach("file", "test/img/test-img.png");

        const response = await request(app.server).delete(`/absence/attachment/${attachment.body.attachmentsId}`)
            .set("Authorization", `Bearer ${accessToken}`).send();

        expect(response.statusCode).toEqual(200);
        expect(response.body).toMatchObject({ message: "Attachment delete successfully!" });

    });
});
