import { makeCreateAbsence } from "@/application/factories/absence/make-create-absence-use-case";
import { CreateAbsenceException } from "@/application/use-cases/absence/errors/create-absence-exception";
import { Absence } from "@/domain/entities/absence-entity";
import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyRequestType } from "fastify/types/type-provider";
import { absenceBodySchema } from "../../zod/schema/absence/absence-schema";

export class CreateAbsenceController {
    public create = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const absenceValidator = this.absenceValidator(request.body);
            const { companyId } = request.user;

            const createAbsenceUseCase = makeCreateAbsence();

            const absenceCreate = new Absence({
                ...absenceValidator,
                companyId: companyId!
            });

            const absence = await createAbsenceUseCase.execute(absenceCreate);

            reply.status(201).send({ absenceId: absence.id });
        } catch (err) {
            if (err instanceof CreateAbsenceException) {
                return reply.status(400).send({ message: err.message });
            }
            throw err;
        }
    };

    private absenceValidator(body: FastifyRequestType["body"]) {
        return absenceBodySchema.parse(body);
    }
}
