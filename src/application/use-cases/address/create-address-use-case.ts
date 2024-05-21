import { Address } from "@/domain/entities/address-entity";
import { AddressRepository } from "@/infra/database/repositories/address-repository";
import { CreateAddressException } from "./errors/create-address-exception";

export class CreateAddressUseCase {
    constructor(private addressRepository: AddressRepository) { }

    async execute(addressInput: Address): Promise<Address> {
        try {
            return await this.addressRepository.create(addressInput);
        } catch (err: any) {
            throw new CreateAddressException(err);
        }
    }
}
