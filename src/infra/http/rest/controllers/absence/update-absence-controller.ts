import { makeUpdateAbsence } from "@/application/factories/absence/make-update-absence-use-case";
import { UpdateAbsenceException } from "@/application/use-cases/absence/errors/update-absence-exception";
import { Absence } from "@/domain/entities/absence-entity";
import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyRequestType } from "fastify/types/type-provider";
import { absenceBodySchema } from "../../zod/schema/absence/absence-schema";

export class UpdateAbsenceController {
    public update = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const absenceValidator = this.absenceValidator(request.body);
            const { id } = request.params as { id: string };
            const { companyId } = request.user;

            const updateAbsenceUseCase = makeUpdateAbsence();

            const updateAbsence = new Absence({
                id,
                ...absenceValidator,
                companyId: companyId!
            });

            await updateAbsenceUseCase.execute(updateAbsence);

            reply.status(200).send({ message: "Absence update successfully!" });
        } catch (err) {
            if (err instanceof UpdateAbsenceException) {
                return reply.status(400).send({ message: err.message });
            }
            throw err;
        }
    };

    private absenceValidator(body: FastifyRequestType["body"]) {
        return absenceBodySchema.parse(body);
    }
}
