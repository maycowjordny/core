import { makeFetchEmployeeByNameOrCpf } from "@/application/factories/employee/make-fetch-employee-by-name-or-cpf-use-case";
import { FetchEmployeeException } from "@/application/use-cases/employee/errors/fetch-employee-exception";
import { Employee } from "@/domain/entities/employee-entity";
import { FastifyReply, FastifyRequest } from "fastify";

export class FetchEmployeeByNameOrCpfController {

    public fetch = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { filter } = request.query as { filter: string };

            const fetchEmployeeByNameOrCpfUseCase = makeFetchEmployeeByNameOrCpf();

            const employees: Employee[] = await fetchEmployeeByNameOrCpfUseCase.execute(filter);

            reply.status(200).send(employees);
        } catch (err) {
            if (err instanceof FetchEmployeeException) {
                reply.status(400).send({ message: err.message });
            }
            throw err;
        }
    };
}
