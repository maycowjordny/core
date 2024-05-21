import { Absence } from "@/domain/entities/absence-entity";
import { AbsenceRequest } from "@/domain/interfaces/absence";
import { prisma } from "../../lib/prisma";
import { AbsenceRepository } from "../../repositories/absence-repository";
import { AbsenceMapper } from "../mappers/absence/absence-mapper";
import { CreateAbsenceMapper } from "../mappers/absence/create-absence-mapper";
import { UpdateAbsenceMapper } from "../mappers/absence/update-absence";

export class PrismaAbsenceRepository implements AbsenceRepository {
    async create(absence: Absence): Promise<Absence> {
        const result = await prisma.absence.create({
            data: CreateAbsenceMapper.convertToPrisma(absence),
        });

        return AbsenceMapper.toDomain(result);
    }

    async findManyByEmployee(employeeId: string): Promise<Absence[]> {
        const absence = await prisma.absence.findMany({
            where: {
                employeeId,
            }
        });

        return absence.map(AbsenceMapper.toDomain);
    }

    async update(absence: Absence): Promise<Absence> {
        const result = await prisma.absence.update({
            where: {
                id: absence.id
            },
            data: UpdateAbsenceMapper.convertToPrisma(absence)
        });

        return AbsenceMapper.toDomain(result);
    }

    async findManyByCompany({ companyId, pagination: { page, take } }: AbsenceRequest): Promise<Absence[]> {
        const result = await prisma.absence.findMany({
            where: {
                employee: {
                    companyId
                }
            },
            skip: (page - 1) * take,
            take,
        });

        return result.map(AbsenceMapper.toDomain);
    }

    async delete(id: string): Promise<null> {
        await prisma.absence.delete({
            where: {
                id
            }
        });

        return null;
    }
}
