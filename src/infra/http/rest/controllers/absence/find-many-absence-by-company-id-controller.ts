import { makeFindManyAbsenceByCompanyId } from "@/application/factories/absence/make-find-absence-by-company-id-use-case";
import { FindAbsenceByCompanyIdException } from "@/application/use-cases/absence/errors/find-many-absence-by-company-id-exception";
import { FastifyReply, FastifyRequest } from "fastify";

export class FindManyAbsenceByCompanyIdController {

    public find = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { companyId } = request.user;
            const { page, take } = request.query as { page: string, take: string };

            const findManyAbsenceByCompanyIdUseCase = makeFindManyAbsenceByCompanyId();

            const absences = await findManyAbsenceByCompanyIdUseCase.execute({
                companyId: companyId!,
                pagination: { page: Number(page), take: Number(take) }
            });

            reply.status(200).send(absences);
        } catch (err) {
            if (err instanceof FindAbsenceByCompanyIdException) {
                reply.status(400).send({ message: err.message });
            }
            throw err;
        }
    };
}
