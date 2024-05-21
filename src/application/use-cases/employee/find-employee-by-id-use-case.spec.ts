import { InMemoryEmployeeRepository } from "@/infra/database/in-memory-repository/in-memory-employee-repository";
import { makeFakeEmployee } from "test/factories/employee-factory";
import { makeFakeUser } from "test/factories/user-factory";
import { beforeEach, describe, expect, it } from "vitest";
import { FindEmployeeByIdUseCase } from "./find-employee-by-id-use-case";

describe("FindEmployeeByIdUseCase", () => {
    let employeesRepository: InMemoryEmployeeRepository;
    let findByIdEmployeeUseCase: FindEmployeeByIdUseCase;

    beforeEach(() => {
        employeesRepository = new InMemoryEmployeeRepository();
        findByIdEmployeeUseCase = new FindEmployeeByIdUseCase(employeesRepository);
    });

    it("should be able to find an employee by id", async () => {
        const user = makeFakeUser();

        const employee = makeFakeEmployee({
            id: "employeeId-01",
            companyId: "companyId-01",
            user: user,
        });

        const createEmployee = await employeesRepository.create(employee);

        const output = await findByIdEmployeeUseCase.execute(createEmployee.id!);

        const response = {
            id: "employeeId-01",
            companyId: "companyId-01",
            user: output?.user,
            document: output?.document,
            admissionDate: output?.admissionDate,
            hourlyWage: output?.hourlyWage,
            phone: output?.phone,
            registerCode: output?.registerCode,
            accessMethod: output?.accessMethod,
            gender: output?.gender,
            office: output?.office,
            initialDate: output?.initialDate,
            presence: true,
        };

        expect(output?.props).toMatchObject(response);
    });

    it("should returning null when id not found", async () => {
        const employee = makeFakeEmployee({ id: "employeeId-01" });

        const output = await findByIdEmployeeUseCase.execute(employee.id!);

        expect(output).toBeNull();
    });
});
