
import { makeUpdateWorkPeriod } from "@/application/factories/work-period/make-update-work-period";
import { UpdateWorkPeriodException } from "@/application/use-cases/work-period/errors/update-work-period-exception";
import { UpdateWorkPeriodProps } from "@/domain/interfaces/work-period";
import { FastifyReply, FastifyRequest } from "fastify";
import { workPeriodUpdateSchema } from "../../zod/schema/work-period/update-work-period-schema";

export class WorkPeriodUpdateController {
    public update = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { companyId } = request.user;
            const { codWorkPeriod } = request.params as { codWorkPeriod: string };

            const { workPeriod } = this.workperiodValidator(request);

            const updateWorkPeriodUseCase = makeUpdateWorkPeriod();

            const updateWorkPeriod: UpdateWorkPeriodProps = {
                codWorkPeriod,
                workPeriods: workPeriod.workPeriods,
                companyId: companyId!
            };

            await updateWorkPeriodUseCase.execute(updateWorkPeriod);

            reply.status(200).send({ message: "WorkPeriod update successfully!" });
        } catch (err) {
            if (err instanceof UpdateWorkPeriodException) {
                reply.status(400).send({ message: err.message });
            }
            throw err;
        }
    };

    private workperiodValidator(request: FastifyRequest) {
        return workPeriodUpdateSchema.parse(request.body);
    }

}
