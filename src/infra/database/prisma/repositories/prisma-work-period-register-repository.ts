import { WorkPeriodRegister } from "@/domain/entities/work-period-register-entity";
import { UpdateWorkPeriodRegisterProps, findByEmployeeAndTimeWindowRequest } from "@/domain/interfaces/work-period-register";
import { prisma } from "../../lib/prisma";
import { WorkPeriodRegisterRepository } from "../../repositories/work-period-register-repository";
import { CreateWorkPeriodRegister } from "../mappers/work-period-register/create-work-period-register-mapper";
import { UpdateWorkPeriodRegisterMapper } from "../mappers/work-period-register/update-work-period-register-mapper";
import { WorkPeriodRegisterMapper } from "../mappers/work-period-register/work-period-register-mapper";

export class PrismaWorkPeriodRegisterRepository implements WorkPeriodRegisterRepository {
    async create(workPeriodRegister: WorkPeriodRegister): Promise<WorkPeriodRegister> {
        const result = await prisma.workPeriodRegister.create({
            data: CreateWorkPeriodRegister.convertToPrisma(workPeriodRegister),
        });

        return WorkPeriodRegisterMapper.toDomain(result);
    }

    async findByEmployeeAndTimeWindow({ employeeId, startDate, endDate }: findByEmployeeAndTimeWindowRequest): Promise<WorkPeriodRegister[]> {
        const result = await prisma.workPeriodRegister.findMany({
            where: {
                employeeId,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        return result.map(WorkPeriodRegisterMapper.toDomain);
    }

    async update(data: UpdateWorkPeriodRegisterProps): Promise<WorkPeriodRegister> {
        const result = await prisma.workPeriodRegister.update({
            where: {
                id: data.id,
                employeeId: data.employeeId,
            },
            data: UpdateWorkPeriodRegisterMapper.convertToPrisma(data)
        });

        return WorkPeriodRegisterMapper.toDomain(result);
    }
}
