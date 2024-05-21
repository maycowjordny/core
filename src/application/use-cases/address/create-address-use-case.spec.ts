import { InMemoryAddressRepository } from "@/infra/database/in-memory-repository/in-memory-address-repository";
import { makeFakeAddress } from "test/factories/address-factory";
import { addressRepositoryMock } from "test/mock/address-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateAddressUseCase } from "./create-address-use-case";
import { CreateAddressException } from "./errors/create-address-exception";

describe("CreateAddressUseCase", () => {
    let addressRepository: InMemoryAddressRepository;
    let addressUseCase: CreateAddressUseCase;

    beforeEach(() => {
        addressRepository = new InMemoryAddressRepository();
        addressUseCase = new CreateAddressUseCase(addressRepository);
    });

    it("should be able to create address", async () => {
        const address = makeFakeAddress({
            id: "addressId-01",
            description: "New Address",
        });

        const output = await addressUseCase.execute(address);

        expect(output.props).toMatchObject({
            id: "addressId-01",
            description: "New Address",
        });
    });

    it("cannot create a address when generic error", async () => {
        addressRepositoryMock.create.mockRejectedValue(new Error());

        const createAddressUseCase = new CreateAddressUseCase(addressRepositoryMock);

        const address = makeFakeAddress();

        await expect(createAddressUseCase.execute(address)).rejects.toThrow(CreateAddressException);
    });
});
