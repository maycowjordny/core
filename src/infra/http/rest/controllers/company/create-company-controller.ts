import { makeCreateCompany } from "@/application/factories/company/make-create-company-use-case";
import { CreateCompanyException } from "@/application/use-cases/company/errors/create-company-exception";
import { Address } from "@/domain/entities/address-entity";
import { Company } from "@/domain/entities/company-entity";
import { User } from "@/domain/entities/user-entity";
import { UserRoleEnum, UserStatusEnum, UserTypesEnum } from "@/domain/enum/user-enum";
import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyRequestType } from "fastify/types/type-provider";
import { companyBodySchema } from "../../zod/schema/company/company-schema";

export class CompanyCreateController {
    public create = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const {
                user,
                address,
                categoryId,
                document,
                employeeQuantity,
                phone,
                socialName,
            } = this.companyValidator(request.body);

            const createCompanyUseCase = makeCreateCompany();

            const createUser = new User({
                ...user,
                type: UserTypesEnum.COMPANY,
                role: UserRoleEnum.ADMIN,
                status: UserStatusEnum.PENDING
            });

            const createAddress = new Address({
                description: address.description,
                lat: address.lat,
                lng: address.lng,
            });

            const createCompany = new Company({
                document,
                employeeQuantity,
                phone,
                socialName,
                address: createAddress,
                categoryId,
                user: createUser
            });

            const company = await createCompanyUseCase.execute(createCompany);

            reply.status(201).send({ companyId: company.id });
        } catch (err) {
            if (err instanceof CreateCompanyException) {
                reply.status(400).send({ message: err.message });
            }
            throw err;

        }
    };

    private companyValidator(body: FastifyRequestType["body"]) {
        return companyBodySchema.parse(body);
    }
}
