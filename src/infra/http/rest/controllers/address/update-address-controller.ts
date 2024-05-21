import { makeUpdateAddress } from "@/application/factories/address/make-update-address-use-case";
import { UpdateAddressException } from "@/application/use-cases/address/errors/update-address-exception";
import { Address } from "@/domain/entities/address-entity";
import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyRequestType } from "fastify/types/type-provider";
import { addressBodySchema } from "../../zod/schema/address/address-schema";

export class UpdateAddressController {
    public update = async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const addressValidator = this.addressValidator(request.body);
            const { id } = request.params as { id: string };

            const updateAddressUseCase = makeUpdateAddress();

            const updateAddress = new Address({
                id,
                ...addressValidator,
            });

            await updateAddressUseCase.execute(updateAddress);

            reply.status(200).send({ message: "Address update successfully!" });
        } catch (err) {
            if (err instanceof UpdateAddressException) {
                return reply.status(400).send({ message: err.message });
            }
            throw err;
        }
    };

    private addressValidator(body: FastifyRequestType["body"]) {
        return addressBodySchema.parse(body);
    }
}
