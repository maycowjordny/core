import { InMemoryCompanyRepository } from "@/infra/database/in-memory-repository/in-memory-company-repository";
import { makeFakeCompany } from "test/factories/company-factory";
import { makeFakeUser } from "test/factories/user-factory";
import { SendEmailFaker } from "test/sendEmail/faker-email";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateCompanyUseCase } from "./create-company-use-case";
import { CreateCompanyException } from "./errors/create-company-exception";

describe("CreateCompanyUseCase", () => {
    let companyRepository: InMemoryCompanyRepository;
    let companyUseCase: CreateCompanyUseCase;
    let sendCodeVerificationFaker: SendEmailFaker;
    beforeEach(() => {
        companyRepository = new InMemoryCompanyRepository();
        sendCodeVerificationFaker = new SendEmailFaker();
        companyUseCase = new CreateCompanyUseCase(companyRepository, sendCodeVerificationFaker);
    });

    it("should be able to create company", async () => {
        const user = makeFakeUser();
        const company = makeFakeCompany({ id: "companyId-01", user });

        vi.spyOn(sendCodeVerificationFaker, "execute");

        const output = await companyUseCase.execute(company);

        expect(sendCodeVerificationFaker.execute).toHaveBeenCalled();
        expect(output).toMatchObject({
            id: "companyId-01",
            categoryId: output.categoryId,
            document: output.document,
            socialName: output.socialName,
            employeeQuantity: output.employeeQuantity,
            phone: output.phone,
        });
    });

    it("cannot create an company when generic error", async () => {

        vi.spyOn(companyRepository, "create").mockRejectedValue(Error);

        const company = makeFakeCompany();

        await expect(companyUseCase.execute(company)).rejects.toThrow(
            CreateCompanyException
        );
    });
});
