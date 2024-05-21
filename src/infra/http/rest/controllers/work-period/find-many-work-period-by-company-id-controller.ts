import { makeFindManyWorkPeriodByCompanyId } from "@/application/factories/work-period/make-find-work-period-bt-company-id";
import { FindManyWorkPeriodByCompanyIdException } from "@/application/use-cases/work-period/errors/list-work-period-exception-by-company";
import { FastifyReply, FastifyRequest } from "fastify";

export class FindManyWorkPeriodByCompanyIdController {

    public find = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { companyId } = request.user;

            const findManyWorkPeriodByCompanyIdUseCase = makeFindManyWorkPeriodByCompanyId();

            const workperiods = await findManyWorkPeriodByCompanyIdUseCase.execute(companyId!);

            reply.status(200).send(workperiods);
        } catch (err) {
            if (err instanceof FindManyWorkPeriodByCompanyIdException) {
                reply.status(400).send({ message: err.message });
            }
            throw err;
        }
    };
}
