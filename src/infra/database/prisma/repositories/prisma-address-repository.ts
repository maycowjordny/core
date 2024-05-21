import { Address } from "@/domain/entities/address-entity";
import { prisma } from "../../lib/prisma";
import { AddressRepository } from "../../repositories/address-repository";
import { AddressMapper } from "../mappers/address/address-mapper";
import { CreateAddressMapper } from "../mappers/address/create-address-mapper";
import { UpdateAddressMapper } from "../mappers/address/update-address-mapper";

export class PrismaAddressRepository implements AddressRepository {
    async create(address: Address): Promise<Address> {
        const result = await prisma.address.create({
            data: CreateAddressMapper.convertToPrisma(address),
        });

        return AddressMapper.toDomain(result);
    }

    async update(address: Address): Promise<Address> {
        const result = await prisma.address.update({
            where: {
                id: address.id
            },
            data: UpdateAddressMapper.convertToPrisma(address)
        });

        return AddressMapper.toDomain(result);
    }

}
