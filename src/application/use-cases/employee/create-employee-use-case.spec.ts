import { InMemoryEmployeeRepository } from "@/infra/database/in-memory-repository/in-memory-employee-repository";
import { makeFakeEmployee } from "test/factories/employee-factory";
import { makeFakeUser } from "test/factories/user-factory";
import { employeeRepositoryMock } from "test/mock/employee-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateEmployeeUseCase } from "./create-employee-use-case";
import { CreateEmployeeException } from "./errors/create-employee-exception";

describe("CreateEmployeeUseCase", () => {
    let employeeRepository: InMemoryEmployeeRepository;
    let employeeUseCase: CreateEmployeeUseCase;

    beforeEach(() => {
        employeeRepository = new InMemoryEmployeeRepository();
        employeeUseCase = new CreateEmployeeUseCase(employeeRepository);
    });

    it("should be able to create an employee", async () => {
        const user = makeFakeUser({ id: "userId-01" });

        const employee = makeFakeEmployee({
            id: "employeeId-01",
            user: user,
            companyId: "companyId-01",

        });

        const output = await employeeUseCase.execute(employee);

        expect(output).toMatchObject({
            id: "employeeId-01",
            companyId: "companyId-01",
            document: output.document,
            gender: output.gender,
            accessMethod: output.accessMethod,
            office: output.office,
            initialDate: output.initialDate,
            createdAt: output.createdAt,
        });
    });

    it("cannot create an employee when generic error", async () => {
        employeeRepositoryMock.create.mockRejectedValue(new Error());

        const createEmployeeUseCase = new CreateEmployeeUseCase(employeeRepositoryMock);

        const employee = makeFakeEmployee();

        await expect(createEmployeeUseCase.execute(employee)).rejects.toThrow(CreateEmployeeException);
    });
});
