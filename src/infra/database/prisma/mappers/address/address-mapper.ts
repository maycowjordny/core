import { Address } from "@/domain/entities/address-entity";
import { Address as RawAddress } from "@prisma/client";

export class AddressMapper {
    static toDomain(raw: RawAddress): Address {
        return new Address({
            id: raw.id,
            description: raw.description,
            lat: raw.lat,
            lng: raw.lng,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }
}
