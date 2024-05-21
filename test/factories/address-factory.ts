import { Address, AddressProps } from "@/domain/entities/address-entity";
import { prisma } from "@/infra/database/lib/prisma";
import { AddressMapper } from "@/infra/database/prisma/mappers/address/address-mapper";
import { CreateAddressMapper } from "@/infra/database/prisma/mappers/address/create-address-mapper";
import { faker } from "@faker-js/faker";

type AddressOverrides = {
    id?: string;
    description?: string;
    lat?: string;
    lng?: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export function makeFakeAddress(data = {} as AddressOverrides) {
    const description = faker.lorem.lines();
    const createdAt = faker.date.past();
    const lat = faker.location.latitude();
    const lng = faker.location.longitude();

    const props: AddressProps = {
        id: data.id,
        lat: data.lat || String(lat),
        lng: data.lng || String(lng),
        description: data.description || description,
        createdAt: data.createdAt || createdAt,
    };

    const address = Address.create(props);

    return address;
}

export class AddressFactory {
    constructor() { }
    async makeAddress(data = {} as AddressOverrides): Promise<Address> {
        const address = makeFakeAddress(data);

        const createAddress = await prisma.address.create({ data: CreateAddressMapper.convertToPrisma(address) });

        return AddressMapper.toDomain(createAddress);
    }
}
