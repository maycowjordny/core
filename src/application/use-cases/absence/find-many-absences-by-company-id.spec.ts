import { AbsenceRequest } from "@/domain/interfaces/absence";
import { InMemoryAbsenceRepository } from "@/infra/database/in-memory-repository/in-memory-absence-repository";
import { makeFakeAbsence } from "test/factories/absence-factory";
import { absenceRepositoryMock } from "test/mock/absence-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { FindAbsenceByCompanyIdException } from "./errors/find-many-absence-by-company-id-exception";
import { FindManyAbsenceByCompanyIdUseCase } from "./find-many-absences-by-company-id";

describe("FindManyAbsenceByCompanyIdUseCase", () => {
    let absencesRepository: InMemoryAbsenceRepository;
    let findManyAbsenceByCompanyIdUseCase: FindManyAbsenceByCompanyIdUseCase;

    beforeEach(() => {
        absencesRepository = new InMemoryAbsenceRepository();
        findManyAbsenceByCompanyIdUseCase = new FindManyAbsenceByCompanyIdUseCase(absencesRepository);
    });

    it("should be able to find many absence by companyId and pagination", async () => {
        for (let i = 1; i <= 20; i++) {
            const absence = makeFakeAbsence({ id: `absenceId-${i}`, companyId: "companyId-01" });
            absencesRepository.create(absence);
        }

        const input: AbsenceRequest = {
            companyId: "companyId-01",
            pagination: {
                page: 1,
                take: 20,
            }
        };

        const output = await findManyAbsenceByCompanyIdUseCase.execute(input);

        expect(output).toHaveLength(20);
    });

    it("should be able to find many absence by companyId and pagination", async () => {
        for (let i = 1; i <= 22; i++) {
            const absence = makeFakeAbsence({ id: `absenceId-${i}`, companyId: "companyId-01" });
            absencesRepository.create(absence);
        }

        const input: AbsenceRequest = {
            companyId: "companyId-01",
            pagination: {
                page: 2,
                take: 20,
            }
        };

        const output = await findManyAbsenceByCompanyIdUseCase.execute(input);

        expect(output).toHaveLength(2);
    });

    it("cannot fetch an absence with generic error", async () => {
        absenceRepositoryMock.findManyByCompany.mockRejectedValue(new Error());

        const fetchManyAbsenceUseCase = new FindManyAbsenceByCompanyIdUseCase(absenceRepositoryMock);

        const input: AbsenceRequest = {
            companyId: "companyId-01",
            pagination: {
                page: 1,
                take: 20,
            }
        };

        await expect(fetchManyAbsenceUseCase.execute(input)).rejects.toThrow(FindAbsenceByCompanyIdException);
    });

    it("should return empty array when there is no absence", async () => {
        const input: AbsenceRequest = {
            companyId: "companyId-01",
            pagination: {
                page: 1,
                take: 20,
            }
        };

        expect(findManyAbsenceByCompanyIdUseCase.execute(input)).resolves.toEqual([]);
    });
});
