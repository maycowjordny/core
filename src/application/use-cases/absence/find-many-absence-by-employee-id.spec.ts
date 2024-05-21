import { InMemoryAbsenceRepository } from "@/infra/database/in-memory-repository/in-memory-absence-repository";
import { makeFakeAbsence } from "test/factories/absence-factory";
import { absenceRepositoryMock } from "test/mock/absence-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { FindAbsenceByEmployeeIdException } from "./errors/find-many-absence-by-employee-id-exception";
import { FindManyAbsenceByEmployeeIdUseCase } from "./find-many-absence-by-employee-id";

describe("FindManyAbsenceByEmployeeIdUseCase", () => {
    let absencesRepository: InMemoryAbsenceRepository;
    let fetchManyAbsenceUseCase: FindManyAbsenceByEmployeeIdUseCase;

    beforeEach(() => {
        absencesRepository = new InMemoryAbsenceRepository();
        fetchManyAbsenceUseCase = new FindManyAbsenceByEmployeeIdUseCase(absencesRepository);
    });

    it("should be able to fetch many absence by employeeId", async () => {
        for (let i = 1; i <= 2; i++) {
            const absence = makeFakeAbsence({ id: `absenceId-${i}`, employeeId: "employeeId-01" });
            absencesRepository.items.push(absence);
        }

        const output = await fetchManyAbsenceUseCase.execute("employeeId-01");

        expect(output).toHaveLength(2);
    });

    it("cannot fetch an absence with generic error", async () => {
        absenceRepositoryMock.findManyByEmployee.mockRejectedValue(new Error());

        const fetchManyAbsenceUseCase = new FindManyAbsenceByEmployeeIdUseCase(absenceRepositoryMock);

        const absence = makeFakeAbsence({ employeeId: "employeeId-01" });

        await expect(fetchManyAbsenceUseCase.execute(absence.employeeId)).rejects.toThrow(FindAbsenceByEmployeeIdException);
    });

    it("should return empty array when there is no absence", async () => {
        expect(fetchManyAbsenceUseCase.execute("absenceId-01")).resolves.toEqual([]);
    });
});
