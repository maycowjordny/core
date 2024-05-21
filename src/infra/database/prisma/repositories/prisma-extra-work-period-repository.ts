import { ExtraWorkPeriod } from "@/domain/entities/extra-work-period-entity";
import { ExtraWorkPeriodRequest } from "@/domain/interfaces/extra-work-period";
import { findByEmployeeAndTimeWindowRequest } from "@/domain/interfaces/work-period-register";
import { prisma } from "../../lib/prisma";
import { ExtraWorkPeriodRepository } from "../../repositories/extra-work-period-repository";
import { CreateExtraWorkPeriodMapper } from "../mappers/extra-work-period/create-extra-work-period-mapper";
import { ExtraWorkPeriodMapper } from "../mappers/extra-work-period/extra-work-period-mapper";

export class PrismaExtraWorkPeriodRepository implements ExtraWorkPeriodRepository {

    async create(extraWorkPeriod: ExtraWorkPeriod): Promise<ExtraWorkPeriod> {
        const result = await prisma.extraWorkPeriod.create({
            data: CreateExtraWorkPeriodMapper.convertToPrisma(extraWorkPeriod),
        });

        return ExtraWorkPeriodMapper.toDomain(result);
    }

    async listByWorkPeriod({ pagination: { page, take }, workPeriodId }: ExtraWorkPeriodRequest): Promise<ExtraWorkPeriod[]> {
        const result = await prisma.extraWorkPeriod.findMany({
            where: {
                workPeriodId: workPeriodId,
            },
            skip: (page - 1) * take,
            take: take,
        });

        return result.map(ExtraWorkPeriodMapper.toDomain);
    }

    async findByEmployeeAndTimeWindow(
        { employeeId, endDate, startDate }: findByEmployeeAndTimeWindowRequest
    ): Promise<ExtraWorkPeriod[] | null> {
        const result = await prisma.extraWorkPeriod.findMany({
            where: {
                employeeId,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            }
        });
        return result.map(ExtraWorkPeriodMapper.toDomain);
    }
}
