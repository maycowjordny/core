import { makeCreateWorkPeriod } from "@/application/factories/work-period/make-create-work-period";
import { CreateWorkPeriodException } from "@/application/use-cases/work-period/errors/work-period-create-exception";
import { WorkPeriod } from "@/domain/entities/work-period-entity";
import { randomUUID } from "crypto";
import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyRequestType } from "fastify/types/type-provider";
import { workPeriodBodySchema } from "../../zod/schema/work-period/create-work-period-schema";

export class WorkPeriodCreateController {
    public create = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { companyId } = request.user;
            const { workPeriod } = this.workPeriodValidator(request.body);

            const createWorkPeriodUseCase = makeCreateWorkPeriod();

            const createWorkPeriod = new WorkPeriod({
                workPeriods: workPeriod.workPeriods,
                companyId: companyId!,
                codWorkPeriod: randomUUID()
            });

            const response = await createWorkPeriodUseCase.execute(createWorkPeriod);

            reply.status(201).send({ codWorkPeriod: response.codWorkPeriod });
        } catch (err) {
            if (err instanceof CreateWorkPeriodException) {
                reply.status(400).send({ message: err.message });
            }
            throw err;
        }
    };

    private workPeriodValidator(body: FastifyRequestType["body"]) {
        return workPeriodBodySchema.parse(body);
    }
}
