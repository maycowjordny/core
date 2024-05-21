import { InMemoryEmployeeRepository } from "@/infra/database/in-memory-repository/in-memory-employee-repository";
import { makeFakeEmployee } from "test/factories/employee-factory";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchEmployeeByCpfOrNameUseCase } from "./fetch-employee-by-cpf-or-name-use-case";

describe("FindManyEmployeeUseCase", () => {
    let employeesRepository: InMemoryEmployeeRepository;
    let fetchManyEmployeeByCpfOrNameUseCase: FetchEmployeeByCpfOrNameUseCase;

    beforeEach(() => {
        employeesRepository = new InMemoryEmployeeRepository();
        fetchManyEmployeeByCpfOrNameUseCase = new FetchEmployeeByCpfOrNameUseCase(employeesRepository);
    });

    it("should be able to fetch an employee by document", async () => {
        const employee = makeFakeEmployee({ id: "employee-02" });

        employeesRepository.create(employee);

        const output = await fetchManyEmployeeByCpfOrNameUseCase.execute(employee.document);

        expect(output).toEqual([employee]);
    });

    it("should be able search for employee by CPF before the user enters the CPF completely", async () => {
        const employee = makeFakeEmployee({
            id: "employee-02",
            document: "12345",
        });

        employeesRepository.create(employee);

        const output = await fetchManyEmployeeByCpfOrNameUseCase.execute("12");

        expect(output).toEqual([employee]);
    });

    it("should return an empty employee list", async () => {
        const employee = makeFakeEmployee();

        const output = await fetchManyEmployeeByCpfOrNameUseCase.execute(employee.document);

        expect(output).toEqual([]);
    });
});
