import { Address } from "@/domain/entities/address-entity";
import { InMemoryAddressRepository } from "@/infra/database/in-memory-repository/in-memory-address-repository";
import { makeFakeAddress } from "test/factories/address-factory";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UpdateAddressException } from "./errors/update-address-exception";
import { UpdateAddressUseCase } from "./update-address-use-case";

describe("UpdateAddressUseCase", () => {
    let addressRepository: InMemoryAddressRepository;
    let addressUseCase: UpdateAddressUseCase;

    beforeEach(() => {
        addressRepository = new InMemoryAddressRepository();
        addressUseCase = new UpdateAddressUseCase(addressRepository);
    });

    it("should be able to update address", async () => {
        const address = makeFakeAddress({
            id: "addressId-01",
            description: "description",
        });

        addressRepository.create(address);

        const addressUpdate = new Address({
            description: "New Description",
            lat: "888888",
            lng: "888888",
        });

        const output = await addressUseCase.execute(addressUpdate);

        expect(output).toMatchObject(addressUpdate);
    });

    it("cannot update a address when generic error", async () => {
        vi.spyOn(addressRepository, "update").mockRejectedValue(Error);

        const address = makeFakeAddress();

        await expect(addressUseCase.execute(address)).rejects.toThrow(UpdateAddressException);
    });
});
