import { makeFindManyEmployeeByCompanyId } from "@/application/factories/employee/make-find-employee-by-company-id-use-case";
import { FindManyEmployeeByCompanyIdException } from "@/application/use-cases/employee/errors/find-many-employee-by-company-id-exception";
import { FastifyReply, FastifyRequest } from "fastify";

export class FindManyEmployeeByCompanyIdController {

    public find = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { companyId } = request.user;
            const { page, take } = request.query as { page: string, take: string };

            const findManyEmployeeByCompanyIdUseCase = makeFindManyEmployeeByCompanyId();

            const employees = await findManyEmployeeByCompanyIdUseCase.execute({
                companyId: companyId!,
                pagination: { page: Number(page), take: Number(take) }
            });

            reply.status(200).send(employees);
        } catch (err) {
            if (err instanceof FindManyEmployeeByCompanyIdException) {
                reply.status(400).send({ message: err.message });
            }
            throw err;
        }
    };
}
