import { Address } from "@/domain/entities/address-entity";
import { AddressRepository } from "@/infra/database/repositories/address-repository";
import { UpdateAddressException } from "./errors/update-address-exception";

export class UpdateAddressUseCase {
    constructor(private addressRepository: AddressRepository) { }

    async execute(addressInput: Address): Promise<Address> {
        try {
            return await this.addressRepository.update(addressInput);
        } catch (err: any) {
            throw new UpdateAddressException(err);
        }
    }
}
