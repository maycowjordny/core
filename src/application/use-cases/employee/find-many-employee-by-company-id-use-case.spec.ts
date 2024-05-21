import { EmployeeRequest } from "@/domain/interfaces/employee";
import { InMemoryEmployeeRepository } from "@/infra/database/in-memory-repository/in-memory-employee-repository";
import { makeFakeEmployee } from "test/factories/employee-factory";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FindManyEmployeeByCompanyIdException } from "./errors/find-many-employee-by-company-id-exception";
import { FindManyEmployeeByCompanyIdUseCase } from "./find-many-employee-by-company-id-use-case";

describe("FindManyEmployeeByCompanyIdUseCase", () => {
    let employeeRepository: InMemoryEmployeeRepository;
    let findManyEmployeeByCompanyIdUseCase: FindManyEmployeeByCompanyIdUseCase;

    beforeEach(() => {
        employeeRepository = new InMemoryEmployeeRepository();
        findManyEmployeeByCompanyIdUseCase = new FindManyEmployeeByCompanyIdUseCase(employeeRepository);
    });

    it("should be able to find many employee by companyId and pagination", async () => {

        for (let i = 1; i <= 22; i++) {
            const employee = makeFakeEmployee({ companyId: "companyId-01" });
            employeeRepository.create(employee);
        }

        const input: EmployeeRequest = {
            pagination: {
                page: 1,
                take: 20
            },
            companyId: "companyId-01"
        };

        const output = await findManyEmployeeByCompanyIdUseCase.execute(input);

        expect(output).toHaveLength(20);
    });

    it("should be able to find many employee by companyId and pagination", async () => {

        for (let i = 1; i <= 22; i++) {
            const employee = makeFakeEmployee({ companyId: "companyId-01" });
            employeeRepository.create(employee);
        }

        const input: EmployeeRequest = {
            pagination: {
                page: 2,
                take: 20
            },
            companyId: "companyId-01"
        };

        const output = await findManyEmployeeByCompanyIdUseCase.execute(input);

        expect(output).toHaveLength(2);
    });

    it("cannot find many employee by companyId when generic error", async () => {
        const employee = makeFakeEmployee({ companyId: "companyId-01" });

        employeeRepository.create(employee);

        const input: EmployeeRequest = {
            pagination: {
                page: 1,
                take: 20
            },
            companyId: employee.companyId
        };

        vi.spyOn(employeeRepository, "findManyByCompany").mockRejectedValue(Error);

        await expect(findManyEmployeeByCompanyIdUseCase.execute(input)).rejects.toThrow(FindManyEmployeeByCompanyIdException);
    });
});
