import { DeactivateEmployeeProps } from "@/domain/interfaces/employee";
import { InMemoryEmployeeRepository } from "@/infra/database/in-memory-repository/in-memory-employee-repository";
import { PRISMA_NOT_FOUND_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { makeFakeEmployee } from "test/factories/employee-factory";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DeactivateEmployeeUseCase } from "./deactivate-employee-use-case";
import { DeactivateEmployeeException } from "./errors/deactive-employee-exception";
import { EmployeeNotFoundException } from "./errors/not-found-employee-exception";

describe("DeactivateEmployeeUseCase", () => {
    let employeeRepository: InMemoryEmployeeRepository;
    let deactivateEmployeeUseCase: DeactivateEmployeeUseCase;

    beforeEach(() => {
        employeeRepository = new InMemoryEmployeeRepository();
        deactivateEmployeeUseCase = new DeactivateEmployeeUseCase(employeeRepository);
    });

    it("should be able deactivate an employee", async () => {
        const employee = makeFakeEmployee({
            id: "employeeId-01",
            companyId: "companyId-01"
        });

        await employeeRepository.create(employee);

        const response: DeactivateEmployeeProps = {
            companyId: employee.companyId,
            id: employee.id!,
            isActive: employee.isActive,
        };

        const output = await deactivateEmployeeUseCase.execute(response);

        expect(output.isActive).toBeFalsy();
    });

    it("cannot deactivate an employee with generic error", async () => {

        const employee = makeFakeEmployee({
            id: "employeeId-01",
            companyId: "companyId-01"
        });

        await employeeRepository.create(employee);

        const response: DeactivateEmployeeProps = {
            companyId: employee.companyId,
            id: employee.id!,
            isActive: employee.isActive,
        };

        vi.spyOn(employeeRepository, "deactivate").mockRejectedValue(Error);

        await expect(deactivateEmployeeUseCase.execute(response)).rejects.toThrow(DeactivateEmployeeException);
    });

    it("cannot deactivate an employee with employee not found error", async () => {

        const employee = makeFakeEmployee({
            id: "employeeId-01",
            companyId: "companyId-01"
        });

        await employeeRepository.create(employee);

        const response: DeactivateEmployeeProps = {
            companyId: employee.companyId,
            id: employee.id!,
            isActive: employee.isActive,
        };

        vi.spyOn(employeeRepository, "deactivate").mockRejectedValue({ code: PRISMA_NOT_FOUND_EXCEPTION });

        await expect(deactivateEmployeeUseCase.execute(response)).rejects.toThrow(EmployeeNotFoundException);
    });

});
