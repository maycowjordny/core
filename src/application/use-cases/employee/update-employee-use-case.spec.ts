import { Employee } from "@/domain/entities/employee-entity";
import { AccessMethodEnum } from "@/domain/enum/employee-enum";
import { InMemoryEmployeeRepository } from "@/infra/database/in-memory-repository/in-memory-employee-repository";
import { PRISMA_NOT_FOUND_EXCEPTION } from "@/infra/database/prisma/constants/constants";
import { makeFakeEmployee } from "test/factories/employee-factory";
import { employeeRepositoryMock } from "test/mock/employee-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { EmployeeNotFoundException } from "./errors/not-found-employee-exception";
import { UpdateEmployeeException } from "./errors/update-employee-exception";
import { UpdateEmployeeUseCase } from "./update-employee-use-case";

describe("UpdateEmployeeUseCase", () => {
    let employeesRepository: InMemoryEmployeeRepository;
    let updateEmployeeUseCase: UpdateEmployeeUseCase;

    beforeEach(() => {
        employeesRepository = new InMemoryEmployeeRepository();
        updateEmployeeUseCase = new UpdateEmployeeUseCase(employeesRepository);
    });

    it("should be able to update an employee", async () => {
        const employee = makeFakeEmployee({
            id: "employee-01",
            presence: true,
            document: "99999999999",
            gender: "male",
            office: "manager",
            accessMethod: AccessMethodEnum.WEB,
            initialDate: "10/10/2023",
        });

        employeesRepository.create(employee);

        const response = new Employee({
            ...employee.props,
            document: "88888888888",
            presence: false,
            gender: "female",
            office: "CEO",
            accessMethod: AccessMethodEnum.WEB_APP,
            initialDate: "11/11/2023",
        });

        const output = await updateEmployeeUseCase.execute(response);

        expect(output).toMatchObject(response);
    });

    it("cannot update an employee when generic error", async () => {
        employeeRepositoryMock.update.mockRejectedValue(new Error());

        const updateEmployeeUseCase = new UpdateEmployeeUseCase(employeeRepositoryMock);

        const employee = makeFakeEmployee();

        await expect(updateEmployeeUseCase.execute(employee)).rejects.toThrow(UpdateEmployeeException);
    });

    it("cannot update an employee when prisma not found error", async () => {
        employeeRepositoryMock.update.mockRejectedValue({ code: PRISMA_NOT_FOUND_EXCEPTION, });

        const updateEmployeeUseCase = new UpdateEmployeeUseCase(employeeRepositoryMock);

        const employee = makeFakeEmployee();

        await expect(updateEmployeeUseCase.execute(employee)).rejects.toThrow(EmployeeNotFoundException);
    });
});
