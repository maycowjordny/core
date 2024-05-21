import { Address } from "@/domain/entities/address-entity";
import { AddressRepository } from "../repositories/address-repository";

export class InMemoryAddressRepository implements AddressRepository {
    public items: Array<Address> = [];

    async create(address: Address): Promise<Address> {
        this.items.push(address);

        return address;
    }

    async update(address: Address): Promise<Address> {
        const addresses = this.items.filter(item => item.id == address.id)[0];

        const newAddress = new Address({
            ...addresses,
            description: address.description,
            lat: address.lat,
            lng: address.lng,
        });

        return newAddress;
    }
}
