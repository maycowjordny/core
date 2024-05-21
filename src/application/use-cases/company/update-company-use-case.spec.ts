import { UpdateCompanyProps } from "@/domain/interfaces/company";
import { InMemoryCompanyRepository } from "@/infra/database/in-memory-repository/in-memory-company-repository";
import { PRISMA_NOT_FOUND_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { makeFakeCompany } from "test/factories/company-factory";
import { companyRepositoryMock } from "test/mock/company-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { CompanyNotFoundException } from "./errors/not-found-company-exception";
import { UpdateCompanyException } from "./errors/update-company-exception";
import { UpdateCompanyUseCase } from "./update-company-use-case";

describe("UpdateCompanyUseCase", () => {
    let companyRepository: InMemoryCompanyRepository;
    let updateCompanyUseCase: UpdateCompanyUseCase;

    beforeEach(() => {
        companyRepository = new InMemoryCompanyRepository();
        updateCompanyUseCase = new UpdateCompanyUseCase(companyRepository);
    });

    it("should be able to update a company", async () => {
        const company = makeFakeCompany({
            id: "company-01",
            employeeQuantity: 5,
            phone: "99999999",
            document: "document",
            socialName: "socialName",
            categoryId: "categoryId-01",
        });

        companyRepository.create(company);

        const response: UpdateCompanyProps = {
            id: "company-01",
            employeeQuantity: 10,
            phone: "88888888",
            document: "documentUpdated",
            socialName: "socialNameUpdated",
            categoryId: "categoryId-02"
        };

        const output = await updateCompanyUseCase.execute(response);

        expect(output).toMatchObject(response);
    });

    it("cannot update a company when generic error", async () => {
        companyRepositoryMock.update.mockRejectedValue(new Error());

        const updateCompanyUseCase = new UpdateCompanyUseCase(companyRepositoryMock);

        const company = makeFakeCompany();

        await expect(updateCompanyUseCase.execute({ ...company.props, id: company.id! })).rejects.toThrow(UpdateCompanyException);
    });

    it("cannot update a company when prisma not found error", async () => {
        companyRepositoryMock.update.mockRejectedValue({ code: PRISMA_NOT_FOUND_EXCEPTION, });

        const updateCompanyUseCase = new UpdateCompanyUseCase(companyRepositoryMock);

        const company = makeFakeCompany();

        await expect(updateCompanyUseCase.execute({ ...company.props, id: company.id! })).rejects.toThrow(CompanyNotFoundException);
    });
});
