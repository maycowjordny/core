import { InMemoryAbsenceRepository } from "@/infra/database/in-memory-repository/in-memory-absence-repository";
import { makeFakeAbsence } from "test/factories/absence-factory";
import { absenceRepositoryMock } from "test/mock/absence-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateAbsenceUseCase } from "./create-absence-use-case";
import { CreateAbsenceException } from "./errors/create-absence-exception";

describe("CreateAbsenceUseCase", () => {
    let absenceRepository: InMemoryAbsenceRepository;
    let absenceUseCase: CreateAbsenceUseCase;

    beforeEach(() => {
        absenceRepository = new InMemoryAbsenceRepository();
        absenceUseCase = new CreateAbsenceUseCase(absenceRepository);
    });

    it("should be able to create absence", async () => {
        const absence = makeFakeAbsence({
            id: "absenceId-01",
            description: "New Absence",
        });

        absenceRepository.create(absence);

        const output = await absenceUseCase.execute(absence);

        expect(output.props).toMatchObject({
            id: "absenceId-01",
            description: "New Absence",
        });
    });

    it("cannot create a absence when generic error", async () => {
        absenceRepositoryMock.create.mockRejectedValue(Error);

        const createAbsenceUseCase = new CreateAbsenceUseCase(absenceRepositoryMock);

        const absence = makeFakeAbsence();

        await expect(createAbsenceUseCase.execute(absence)).rejects.toThrow(CreateAbsenceException);
    });
});
