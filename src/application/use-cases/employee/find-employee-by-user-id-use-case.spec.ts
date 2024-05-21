import { InMemoryEmployeeRepository } from "@/infra/database/in-memory-repository/in-memory-employee-repository";
import { makeFakeEmployee } from "test/factories/employee-factory";
import { makeFakeUser } from "test/factories/user-factory";
import { beforeEach, describe, expect, it } from "vitest";
import { FindEmployeeByUserIdUseCase } from "./find-employee-by-user-id-use-case";

describe("FindEmployeeByUserIdUseCase", () => {
    let employeesRepository: InMemoryEmployeeRepository;
    let findByUserIdEmployeeUseCase: FindEmployeeByUserIdUseCase;

    beforeEach(() => {
        employeesRepository = new InMemoryEmployeeRepository();
        findByUserIdEmployeeUseCase = new FindEmployeeByUserIdUseCase(employeesRepository);
    });

    it("should be able to find an employee by userd", async () => {
        const user = makeFakeUser();

        const employee = makeFakeEmployee({
            id: "employeeId-01",
            companyId: "companyId-01",
            user: user,
        });

        await employeesRepository.create(employee);

        const output = await findByUserIdEmployeeUseCase.execute(user.id!);

        const response = {
            id: employee.id,
            companyId: employee.companyId,
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

    it("should returning null when userId not found", async () => {
        const user = makeFakeUser();

        const output = await findByUserIdEmployeeUseCase.execute(user.id!);

        expect(output).toBeNull();
    });
});
