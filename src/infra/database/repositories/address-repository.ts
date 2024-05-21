import { Address } from "@/domain/entities/address-entity";

export interface AddressRepository {
  create(address: Address): Promise<Address>;
  update(address: Address): Promise<Address>;
}
