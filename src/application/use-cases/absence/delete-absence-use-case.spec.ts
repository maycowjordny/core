import { InMemoryAbsenceRepository } from "@/infra/database/in-memory-repository/in-memory-absence-repository";
import { makeFakeAbsence } from "test/factories/absence-factory";
import { absenceRepositoryMock } from "test/mock/absence-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { DeleteAbsenceUseCase } from "./delete-absence-use-case";
import { DeleteAbsenceException } from "./errors/delete-absence-exception";

describe("DeleteAbsenceUseCase", () => {
    let absenceRepository: InMemoryAbsenceRepository;
    let absenceUseCase: DeleteAbsenceUseCase;

    beforeEach(() => {
        absenceRepository = new InMemoryAbsenceRepository();
        absenceUseCase = new DeleteAbsenceUseCase(absenceRepository);
    });

    it("should be able to delete absence", async () => {
        const absence = makeFakeAbsence({ id: "absenceId-01" });

        absenceRepository.create(absence);

        const output = await absenceUseCase.execute(absence.id!);

        expect(output).toBeNull();
        expect(absenceRepository.items.map(item => item)).toHaveLength(0);
    });

    it("cannot delete a absence when generic error", async () => {
        absenceRepositoryMock.delete.mockRejectedValue(Error);

        const deleteAbsenceUseCase = new DeleteAbsenceUseCase(absenceRepositoryMock);

        const absence = makeFakeAbsence();

        await expect(deleteAbsenceUseCase.execute(absence.id!)).rejects.toThrow(DeleteAbsenceException);
    });
});
