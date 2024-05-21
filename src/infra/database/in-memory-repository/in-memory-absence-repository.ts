import { Absence } from "@/domain/entities/absence-entity";
import { AbsenceRequest } from "@/domain/interfaces/absence";
import { AbsenceRepository } from "../repositories/absence-repository";

export class InMemoryAbsenceRepository implements AbsenceRepository {
    public items: Array<Absence> = [];

    async findManyByEmployee(employeeId: string): Promise<Absence[]> {

        const absence = this.items.filter(item => item.employeeId == employeeId);

        return absence;

    }

    async create(absence: Absence): Promise<Absence> {
        this.items.push(absence);

        return absence;
    }

    async update(absence: Absence): Promise<Absence> {
        const result = this.items.filter(item => item.id == absence.id)[0];

        const newAbsence = new Absence({
            ...result.props,
            description: absence.description,
            endDate: absence.endDate,
            initialDate: absence.initialDate,
            type: absence.type,
            employeeId: absence.employeeId
        });

        return newAbsence;
    }

    async findManyByCompany({ companyId, pagination: { page, take } }: AbsenceRequest): Promise<Absence[]> {
        const absence = this.items.filter(item => item.companyId == companyId);

        return absence.slice((page - 1) * take, page * take);

    }

    async delete(id: string): Promise<null> {
        const absence = this.items.findIndex((item) => item.id == id);

        if (absence !== -1) this.items.splice(absence, 1);

        return null;
    }
}
