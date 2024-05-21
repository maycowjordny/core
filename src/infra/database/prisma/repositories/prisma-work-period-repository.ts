import { CreateWorkPeriodException } from "@/application/use-cases/work-period/errors/work-period-create-exception";
import { WorkPeriod } from "@/domain/entities/work-period-entity";
import { WeekdayEnum } from "@/domain/enum/week-day-enum";
import { UpdateWorkPeriodProps } from "@/domain/interfaces/work-period";
import { findByEmployeeAndTimeWindowRequest } from "@/domain/interfaces/work-period-register";
import { Weekday } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { WorkPeriodRepository } from "../../repositories/work-period-repository";
import { CreateWorkPeriodMapper } from "../mappers/work-period/create-work-period-mapper";
import { UpdateWorkPeriodMapper } from "../mappers/work-period/update-work-period-mapper";
import { WorkPeriodMapper } from "../mappers/work-period/work-period-mapper";

export class PrismaWorkPeriodRepository implements WorkPeriodRepository {
    async create(workPeriod: WorkPeriod): Promise<WorkPeriod> {

        const result = await prisma.workPeriod.createMany({
            data: CreateWorkPeriodMapper.convertToPrisma(workPeriod)
        });

        if (!result.count) throw new CreateWorkPeriodException();

        return workPeriod;
    }

    async findByCodWorkPeriodAndDay(codWorkPeriod: string, day: WeekdayEnum): Promise<WorkPeriod | null> {
        const workPeriod = await prisma.workPeriod.findUnique({
            where: {
                COD_WORK_PERIOD_DAY_UNIQUE: {
                    codWorkPeriod,
                    day: day as Weekday,
                }
            },
        });

        return workPeriod && WorkPeriodMapper.toDomain(workPeriod);
    }

    async findByCodWorkPeriod(codWorkPeriod: string): Promise<WorkPeriod | null> {
        const workPeriod = await prisma.workPeriod.findMany({
            where: {
                codWorkPeriod,
            },
        });

        return workPeriod && WorkPeriodMapper.toDomainFromList(workPeriod);
    }

    async findByEmployeeAndTimeWindow({ employeeId, endDate, startDate }: findByEmployeeAndTimeWindowRequest): Promise<WorkPeriod | null> {
        const workPeriod = await prisma.workPeriod.findMany({
            include: {
                employee: true
            },
            where: {
                employee: {
                    some: {
                        id: employeeId
                    }
                },

                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        return workPeriod && WorkPeriodMapper.toDomainFromList(workPeriod);

    }

    async findManyByCompany(companyId: string): Promise<WorkPeriod[]> {
        const workPeriods = await prisma.workPeriod.findMany({
            where: {
                companyId
            },
            orderBy: {
                name: "asc",
            },
        });

        return workPeriods.map(raw => WorkPeriodMapper.toDomainFromList([raw]));
    }

    async update(workPeriod: UpdateWorkPeriodProps): Promise<WorkPeriod> {

        workPeriod.workPeriods.forEach(async element => {
            await prisma.workPeriod.update({
                where: {
                    COD_WORK_PERIOD_DAY_UNIQUE: {
                        codWorkPeriod: workPeriod.codWorkPeriod,
                        day: element.day,
                    }
                },
                data: UpdateWorkPeriodMapper.convertToPrisma(workPeriod)
            });
        });

        return WorkPeriodMapper.toDomainFromUpdate(workPeriod);
    }

    async delete(id: string): Promise<null> {
        await prisma.workPeriod.delete({
            where: {
                id
            }
        });

        return null;
    }

}
