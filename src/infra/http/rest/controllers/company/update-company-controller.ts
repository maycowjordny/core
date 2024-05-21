import { makeUpdateCompany } from "@/application/factories/company/make-update-company-use-case";
import { UpdateCompanyException } from "@/application/use-cases/company/errors/update-company-exception";
import { UpdateCompanyProps } from "@/domain/interfaces/company";
import { FastifyReply, FastifyRequest } from "fastify";
import { companyUpdateSchema } from "../../zod/schema/company/update-company-schema";

export class CompanyUpdateController {
    public update = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id } = request.params as { id: string };

            const companyValidate = this.companyValidator(request);

            const updateCompanyUseCase = makeUpdateCompany();

            const updateCompany: UpdateCompanyProps = {
                id,
                ...companyValidate,
            };

            await updateCompanyUseCase.execute(updateCompany);

            reply.status(200).send({ message: "Company update successfully!" });
        } catch (err) {
            if (err instanceof UpdateCompanyException) {
                reply.status(400).send({ message: err.message });
            }
            throw err;
        }
    };

    private companyValidator(request: FastifyRequest) {
        return companyUpdateSchema.parse(request.body);
    }

}
