import { Address } from "@/domain/entities/address-entity";
import { Prisma } from "@prisma/client";
import { AddressMapper } from "./address-mapper";

export class CreateAddressMapper extends AddressMapper {
    static convertToPrisma(address: Address): Prisma.AddressCreateInput {
        return {
            description: address.description,
            lat: address.lat,
            lng: address.lng,
        };
    }
}
