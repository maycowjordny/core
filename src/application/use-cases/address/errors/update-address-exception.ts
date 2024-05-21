import { DomainError } from "@/core/domain/errors/domain-error";

export class UpdateAddressException extends Error implements DomainError {
    constructor(error?: string) {
        super(`Cannot update address with error: '${error ? error : "generic"}'.`);
        this.name = "UpdateAddressException";
    }
}
