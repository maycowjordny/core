import { InMemoryCompanyRepository } from "@/infra/database/in-memory-repository/in-memory-company-repository";
import { InMemoryEmployeeRepository } from "@/infra/database/in-memory-repository/in-memory-employee-repository";
import { PRISMA_NOT_FOUND_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { makeFakeCompany } from "test/factories/company-factory";
import { makeFakeEmployee } from "test/factories/employee-factory";
import { makeFakeWorkPeriodRegister } from "test/factories/work-period-register-factory";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LocationNotFoundException } from "../work-period-register/errors/location-not-found-exception";
import { FindLocationByIdException } from "./errors/find-location-by-id-exception";
import { FindLocationByEmployeeIdUseCase } from "./find-location-by-id-use-case";

describe("FindLocationByEmployeeIdUseCase", () => {
    let employeesRepository: InMemoryEmployeeRepository;
    let companyRepository: InMemoryCompanyRepository;
    let findLocationByEmployeeIdUseCase: FindLocationByEmployeeIdUseCase;

    beforeEach(() => {
        employeesRepository = new InMemoryEmployeeRepository();
        companyRepository = new InMemoryCompanyRepository();
        findLocationByEmployeeIdUseCase = new FindLocationByEmployeeIdUseCase(employeesRepository);
    });

    it("should be able to fetch a location by employeeId", async () => {
        const company = makeFakeCompany();

        companyRepository.create(company);

        const employee = makeFakeEmployee();

        employeesRepository.create(employee);

        const output = await findLocationByEmployeeIdUseCase.execute(employee.id!);

        expect(output).toMatchObject({
            company: {
                address: {
                    "lat": "41.7128",
                    "lng": "-74.0060",
                },
                addressId: "simulatedAddressId",
                categoryId: "categoryId-01",
                document: "document",
                employeeQuantity: 2,
                id: "simulatedCompanyId",
                phone: "88 88888888",
                socialName: "socialName",
            }
        });
    });

    it("cannot fetch location when location not found", async () => {
        vi.spyOn(employeesRepository, "findLocationById").mockRejectedValue({ code: PRISMA_NOT_FOUND_EXCEPTION });

        const workPeriodRegister = makeFakeWorkPeriodRegister({ employeeId: "employeeId-01" });

        await expect(findLocationByEmployeeIdUseCase.execute(workPeriodRegister.employeeId)).rejects.toThrow(LocationNotFoundException);
    });

    it("cannot fetch location when generic error", async () => {
        vi.spyOn(employeesRepository, "findLocationById").mockRejectedValue(new Error());

        const workPeriodRegister = makeFakeWorkPeriodRegister({ employeeId: "employeeId-01" });

        await expect(findLocationByEmployeeIdUseCase.execute(workPeriodRegister.employeeId)).rejects.toThrow(FindLocationByIdException);
    });
});
