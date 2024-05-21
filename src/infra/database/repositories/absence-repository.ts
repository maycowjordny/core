import { Absence } from "@/domain/entities/absence-entity";
import { AbsenceRequest } from "@/domain/interfaces/absence";

export interface AbsenceRepository {
  create(absence: Absence): Promise<Absence>;
  update(absence: Absence): Promise<Absence>;
  delete(id: string): Promise<null>;
  findManyByCompany({ companyId, pagination: { page, take } }: AbsenceRequest): Promise<Absence[]>;
  findManyByEmployee(employeeId: string): Promise<Absence[]>;
}
