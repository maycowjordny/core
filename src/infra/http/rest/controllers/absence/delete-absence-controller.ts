import { makeDeleteAbsence } from "@/application/factories/absence/make-delete-absence-use-case";
import { DeleteAbsenceException } from "@/application/use-cases/absence/errors/delete-absence-exception";
import { FastifyReply, FastifyRequest } from "fastify";

export class DeleteAbsenceController {
    public delete = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id } = request.params as { id: string };

            const deleteAbsenceUseCase = makeDeleteAbsence();

            await deleteAbsenceUseCase.execute(id);

            reply.status(200).send({ message: "Absence delete successfully!" });
        } catch (err) {
            if (err instanceof DeleteAbsenceException) {
                return reply.status(400).send({ message: err.message });
            }
            throw err;
        }
    };
}
