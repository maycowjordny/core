import { Absence } from "@/domain/entities/absence-entity";
import { TypeAbsenceEnum } from "@/domain/enum/absence-enum";
import { InMemoryAbsenceRepository } from "@/infra/database/in-memory-repository/in-memory-absence-repository";
import { makeFakeAbsence } from "test/factories/absence-factory";
import { absenceRepositoryMock } from "test/mock/absence-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { UpdateAbsenceException } from "./errors/update-absence-exception";
import { UpdateAbsenceUseCase } from "./update-absence-use-case";

describe("UpdateAbsenceUseCase", () => {
    let absenceRepository: InMemoryAbsenceRepository;
    let absenceUseCase: UpdateAbsenceUseCase;

    beforeEach(() => {
        absenceRepository = new InMemoryAbsenceRepository();
        absenceUseCase = new UpdateAbsenceUseCase(absenceRepository);
    });

    it("should be able to update absence", async () => {
        const absence = makeFakeAbsence({
            id: "absenceId-01",
            description: "New Absence",
            initialDate: new Date("11/11/2024"),
            endDate: new Date("11/11/2024"),
            type: TypeAbsenceEnum.INSS,
        });

        absenceRepository.create(absence);

        const response = new Absence({
            ...absence.props,
            description: "Absence Updated",
            initialDate: new Date("12/12/2024"),
            endDate: new Date("12/12/2024"),
            type: TypeAbsenceEnum.MEDICAL_CERTIFICATE,
        });

        const output = await absenceUseCase.execute(response);

        expect(output).toMatchObject(response);
    });

    it("cannot update a absence when generic error", async () => {
        absenceRepositoryMock.update.mockRejectedValue(new Error());

        const updateAbsenceUseCase = new UpdateAbsenceUseCase(absenceRepositoryMock);

        const absence = makeFakeAbsence();

        await expect(updateAbsenceUseCase.execute(absence)).rejects.toThrow(UpdateAbsenceException);
    });
});
