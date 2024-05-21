import { UpdateAddressUseCase } from "@/application/use-cases/address/update-address-use-case";
import { PrismaAddressRepository } from "@/infra/database/prisma/repositories/prisma-address-repository";

export function makeUpdateAddress() {
    const addressRepository = new PrismaAddressRepository();
    const updateAddressUseCase = new UpdateAddressUseCase(addressRepository);

    return updateAddressUseCase;
}
