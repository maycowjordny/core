import { Address } from "@/domain/entities/address-entity";
import { Prisma } from "@prisma/client";
import { AddressMapper } from "./address-mapper";

export class UpdateAddressMapper extends AddressMapper {
    static convertToPrisma(data: Address): Prisma.AddressUpdateInput {
        return {
            description: data.description,
            lat: data.lat,
            lng: data.lng,
        };
    }
}
